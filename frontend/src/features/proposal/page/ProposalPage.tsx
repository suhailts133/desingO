import { useState } from "react"
import { useParams, useLocation } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

import { useGetProposalQuery } from "../proposalEndpoints"

import { useDecodeAccessToken } from "../../../helpers/decodeAccessToken"

import type { AcceptOrRejectDisputeDTO, DisputeFormDTO, DisputeResponseDTO, IServiceResult, ReviewPayloadFields } from "../proposalInterface"
import type { RejectionPayload } from "../../user/jobApplications/jobApplicationInterFace"

import { useApproveOrReject } from "../hooks/useApproveOrReject"
import { useWriteReview } from "../hooks/useWriteReview"

import ConfirmModal from "../../../shared/modals/ConfirmModal"
import RejectJobApplicationModal from "../../user/jobApplications/components/RejectJobApplicationModal"
import ReviewForm from "../component/ReviewForm"
import NoProposalCustomer from "../component/NoProposalCustomer"
import NoProposalDesigner from "../component/NoProposalDesigner"
import ServiceCard from "../component/ServiceCard"
import ProposalHeader from "../component/ProposalHeader"
import ContractOverview from "../component/ContractOverview"
import CustomerActionPanel from "../component/CustomerActionPanel"
import ChatPanel from "../chat/ChatPanel"
import PaymentModal from "../component/PaymentModal"
import { useCreateIntent } from "../hooks/useCreateIntent"
import ServiceUploadForm from "../component/ServiceUploadForm"
import toast from "react-hot-toast"
import { useUploadResult } from "../hooks/useUploadResult"
import DisputeForm from "../component/DisputeForm"
import { useReportIssue } from "../hooks/useReportIssue"
import DisputeCard from "../component/DisputeCard"
import { useGetDisputeQuery } from "../disputeEndpoints"
import { useAcceptOrRejectVerdit } from "../hooks/useAcceptOrRejectVerdit"
import { useVerifyPayment } from "../hooks/useVerifyPayment"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function ProposalPage() {
    const { id } = useParams<{ id: string }>()
    const { role } = useDecodeAccessToken()
    const location = useLocation()

    const sourceType = location.state?.sourceType as "jobRequest" | "direct_hire" | undefined
    const sourceId = location.state?.sourceId as string | undefined
    const activeJobId = location.state?.activeJobId as string | undefined

    const { data, isLoading, error, refetch } = useGetProposalQuery(id!, { skip: !id })

    const proposal = data?.data
    const { newStatus } = useApproveOrReject()
    const contractStatus = newStatus ?? proposal?.contractStatus

    const {
        data: disputeData,
        isLoading: isDisputeLoading,
        error: disputeError
    } = useGetDisputeQuery(proposal?.id ?? "", { skip: !proposal || contractStatus !== "Disputed" })
    const disputedData = disputeData?.data

    const { ispaymentDataLoading, clientSecret, paymentIntentError, handlePaymentIntent, reset } = useCreateIntent()
    const { isVerifying, handlePaymentIntentVerification } = useVerifyPayment()

    const { isChangingStatus, statusUpdateError, statusUpdateSuccess, handleUpdateStatus } = useApproveOrReject()
    const { isReviewing, reviewError, reivewSuccess, handleWriteReview } = useWriteReview()
    const { isUploading, uploadError, handleServiceResultUpload } = useUploadResult()
    const { handleVerditSubmit, isChecking } = useAcceptOrRejectVerdit()
    const { isReporting, handleReportIssue, ReportError } = useReportIssue()

    const [chatOpen, setChatOpen] = useState(false)
    const [approveProposal, setApproveProposal] = useState<{ sourceId: string } | null>(null)

    const [rejectProposal, setRejectProposal] = useState<{ sourceId: string } | null>(null)
    const [review, setReview] = useState<{ sourceId: string } | null>(null)
    const [dispute, setDispute] = useState<{ sourceId: string } | null>(null)
    const [reportedDispute, setReportedDispute] = useState<DisputeResponseDTO | null>(null)
    const [uploadingService, setUploadingService] = useState<{
        sourceId: string;
        serviceNumber: number;
        serviceName: string
    } | null>(null)

    const [payingService, setPayingService] = useState<{ serviceName: string; amount: number } | null>(null)

    const activeDispute = reportedDispute ?? disputedData
    const handleVerdit = async (data: AcceptOrRejectDisputeDTO) => {
        await handleVerditSubmit(data)
    }
    const handleApproval = async () => {
        if (!approveProposal) return
        await handleUpdateStatus({ sourceId: approveProposal.sourceId, contractStatus: "Accepted" })
        setApproveProposal(null)
    }
    const handleUpload = (serviceNumber: number, serviceName: string) => {
        if (!proposal) return
        setUploadingService({
            sourceId: proposal.sourceId,
            serviceNumber,
            serviceName
        })
    }

    const handleUploadSubmit = async (data: IServiceResult) => {
        if (!uploadingService) return

        const formData = new FormData()
        formData.append("sourceId", uploadingService.sourceId)
        formData.append("serviceNumber", String(uploadingService.serviceNumber))

        data.serviceResult.forEach((item) => {
            if (item.file[0]) {
                formData.append("serviceResult", item.file[0])
            }
        })
        console.log([...formData.entries()])
        const result = await handleServiceResultUpload(formData)
        if (result) {
            toast.success("Upload Successfull")
        }
        toast.error(uploadError || "Something went Wrong")
        setUploadingService(null)
    }

    const handleRejection = async ({ rejectionReason }: RejectionPayload) => {
        if (!rejectProposal) return
        await handleUpdateStatus({
            sourceId: rejectProposal.sourceId,
            contractStatus: "Rejected",
            overallRejectionReason: rejectionReason
        })
        setRejectProposal(null)
    }

    const handleWriteReveiw = async (data: ReviewPayloadFields) => {
        if (!review) return
        await handleWriteReview({ sourceId: review.sourceId, comment: data.comment, rating: data.rating })
        setReview(null)
    }

    const handleRaiseIssue = async (data: DisputeFormDTO) => {
        if (!dispute) return
        const formData = new FormData();
        const service = proposal?.services.find((e) =>
            ["Open", "In Progress", "Uploaded", "Redo"].includes(e.status)
        );
        formData.append("reason", data.reason)
        formData.append("type", data.type.label)
        formData.append("order", `${service?.order!}`)
        formData.append("sourceId", proposal?.sourceId!)
        data.evidence.forEach(item => {
            const file = item.file?.[0]
            if (file) {
                formData.append("evidence", file)
            }
        })
        console.log([...formData.entries()])
        const result = await handleReportIssue(formData)
        if (result.success) {
            toast.success("The Issue has been noted")
            setReportedDispute(result.data!)
        } else {
            toast.error(ReportError ?? "Something went wrong")
        }
        setDispute(null)
    }

    const handlePay = async (serviceName: string, amount: number, payemnetSourceId: string) => {
        setPayingService({ serviceName, amount })
        const success = await handlePaymentIntent(payemnetSourceId)
        if (!success) setPayingService(null)
    }

    const handlePaySuccess = async (intentId: string) => {
        reset()
        setPayingService(null)
        const result = await handlePaymentIntentVerification(intentId)
        if(result.success){
            refetch()
            toast.success("Payment Success")
        }
    }

    const handlePayClose = () => {
        reset()
        setPayingService(null)
    }

    if (!role) {
        return <div className="p-10 text-center text-red-500 font-Jost-Semibold">Invalid proposal source.</div>
    }
    if (!activeJobId) {
        return <div className="p-10 text-center text-red-500 font-Jost-Semibold">No Active Job.</div>
    }
    if (role === "Designer" && (!sourceType || !sourceId)) {
        return <div className="p-10 text-center text-red-500 font-Jost-Semibold">Invalid proposal source.</div>
    }
    if (isLoading) {
        return <div className="p-10 text-center animate-pulse text-soft-black/40">Loading proposal...</div>
    }
    if (error) {
        return <div className="p-10 text-center text-red-500 font-Jost-Semibold">Something went wrong. Please try again.</div>
    }
    if (!proposal) {
        return (
            <div className="w-full flex flex-col gap-6">
                {role === "Designer"
                    ? <NoProposalDesigner jobId={id!} sourceType={sourceType!} sourceId={sourceId!} />
                    : <NoProposalCustomer jobId={id!} />
                }
            </div>
        )
    }
    if (disputeError) {
        return <div className="p-10 text-center text-red-500 font-Jost-Semibold">Something went wrong. Please try again.</div>
    }
    if (isDisputeLoading) {
        return <div className="p-10 text-center animate-pulse text-soft-black/40">Loading proposal...</div>
    }

    const showProposalActions = role === "Customer" && contractStatus === "Sent"
    const showUpdateProposal = role === "Designer" && contractStatus === "Rejected"

    return (
        <div className="w-full flex flex-col gap-6">

            <ConfirmModal
                isOpen={!!approveProposal}
                onConfirm={handleApproval}
                onClose={() => setApproveProposal(null)}
                isLoading={isChangingStatus}
                heading="Accept this proposal?"
                text="Once accepted, the designer will be notified and work can begin after the advance payment is made. This action cannot be undone."
                buttonText="Confirm & accept"
                buttonLoadingText="Accepting…"
            />

            <ServiceUploadForm
                isOpen={!!uploadingService}
                onClose={() => setUploadingService(null)}
                onConfirm={handleUploadSubmit}
                isLoading={isUploading}
                sourceId={uploadingService?.sourceId ?? ""}
                serviceNumber={uploadingService?.serviceNumber ?? 0}
            />

            <RejectJobApplicationModal
                isOpen={!!rejectProposal}
                onClose={() => setRejectProposal(null)}
                onConfirm={handleRejection}
                isLoading={isChangingStatus}
            />

            <ReviewForm
                isOpen={!!review}
                onClose={() => setReview(null)}
                onConfirm={handleWriteReveiw}
                isLoading={isReviewing}
            />

            <DisputeForm
                isOpen={!!dispute}
                onClose={() => setDispute(null)}
                onConfirm={handleRaiseIssue}
                isLoading={isReporting}
            />

            <ChatPanel
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                activeJobId={activeJobId}
                otherPersonName={"other"}
                role={role}
            />

            {clientSecret && payingService && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentModal
                        isOpen={!!clientSecret}
                        serviceName={payingService.serviceName}
                        amount={payingService.amount}
                        onSuccess={handlePaySuccess}
                        onClose={handlePayClose}
                    />
                </Elements>
            )}

            <ProposalHeader
                id={id!}
                status={proposal.contractStatus}
                sourceType={proposal.sourceType}
                sourceId={sourceId}
                role={role}
                showUpdateProposal={showUpdateProposal}
                onChatOpen={() => setChatOpen(true)}
            />

            <div>
                <button onClick={() => setReview({ sourceId: proposal.sourceId })} className="soft-black-button">
                    Write Your Review
                </button>
                {reviewError && <p className="text-xs text-red-500">{reviewError}</p>}
                {reivewSuccess && <p className="text-xs text-green-600">{reivewSuccess}</p>}
            </div>
            <div>
                <button onClick={() => setDispute({ sourceId: proposal.sourceId })} className="soft-black-button">
                    Raise a Issue
                </button>
            </div>

            {showProposalActions && (
                <CustomerActionPanel
                    onAccept={() => setApproveProposal({ sourceId: proposal.sourceId })}
                    onDecline={() => setRejectProposal({ sourceId: proposal.sourceId })}
                    statusUpdateError={statusUpdateError}
                    statusUpdateSuccess={statusUpdateSuccess}
                />
            )}

            {contractStatus === "Disputed" && activeDispute && (
                <DisputeCard dispute={activeDispute} isResponding={isChecking} onConfirm={handleVerdit} />
            )}

            <ContractOverview proposal={proposal} />

            {proposal.overallRejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
                    <p className="text-xs font-Jost-Semibold text-red-700 uppercase tracking-widest mb-1">Rejection reason</p>
                    <p className="text-sm text-red-700">{proposal.overallRejectionReason}</p>
                </div>
            )}

            {paymentIntentError && (
                <p className="text-xs text-red-500 text-center">{paymentIntentError}</p>
            )}

            <div className="bg-white rounded-2xl border border-blush-light/40 shadow-sm px-6 py-5">
                <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black/40 mb-4">Services</h2>
                <div className="flex flex-col gap-3">
                    {[...proposal.services]
                        .sort((a, b) => a.order - b.order)
                        .map((service) => (
                            <ServiceCard
                                key={service.order}
                                service={service}
                                role={role}
                                onPay={() => handlePay(service.serviceName, service.price, proposal.sourceId)}
                                onVerify={() => { }}
                                onRedo={() => { }}
                                onUpload={() => handleUpload(service.order, service.serviceName)}
                                isPayLoading={ispaymentDataLoading && payingService?.serviceName === service.serviceName}
                            />
                        ))}
                </div>
            </div>
        </div>
    )
}