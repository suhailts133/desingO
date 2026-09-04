import { useState } from "react"
import { useParams, useLocation } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

import { useGetProposalQuery } from "../proposalEndpoints"

import { useDecodeAccessToken } from "../../../helpers/decodeAccessToken"

import type { AcceptOrRejectDisputeDTO, DisputeFormDTO, FloorPlans, IServiceResult, ReviewPayloadFields } from "../proposalInterface"
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
import ChatPanel from "../chat/component/ChatPanel"
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
import { useHandleResponse } from "../../../helpers/useHandleResponse"
import { useApproveOrRejectVersion } from "../hooks/useApproveOrRejectVersion"
import UploadFloorPlan from "../component/UploadFloorPlan"
import { useUploadFloorPlan } from "../hooks/useUploadFloorPlan"
import { ExternalLink, FileText } from "lucide-react"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function ProposalPage() {
    const { id } = useParams<{ id: string }>()
    const { role } = useDecodeAccessToken()
    const location = useLocation()
    const [approveVersion, setApproveVersion] = useState<string | null>(null)
    const [rejectVersion, setRejectVersion] = useState<string | null>(null)
    const sourceType = location.state?.sourceType as "jobRequest" | "direct_hire" | undefined
    const sourceId = location.state?.sourceId as string | undefined
    const activeJobId = location.state?.activeJobId as string | undefined

    const { data, isLoading, error, refetch } = useGetProposalQuery(id ?? "", { skip: !id })

    const proposal = data?.data

    const contractStatus = proposal?.contractStatus

    const { data: disputeData, isLoading: isDisputeLoading, error: disputeError } = useGetDisputeQuery(proposal?.id ?? "", { skip: !proposal || contractStatus !== "Disputed" })
    const disputedData = disputeData?.data
    const handleResponse = useHandleResponse()
    const { ispaymentDataLoading, clientSecret, paymentIntentError, handlePaymentIntent, reset } = useCreateIntent()
    const { handlePaymentIntentVerification } = useVerifyPayment()

    const { isChangingStatus, handleUpdateStatus } = useApproveOrReject()
    const { isVersionApprovingOrRejecting, handleVersionApprovalOrRejection } = useApproveOrRejectVersion()
    const { isReviewing, handleWriteReview } = useWriteReview()
    const { isUploading, handleServiceResultUpload } = useUploadResult()

    const { handleVerditSubmit, isChecking } = useAcceptOrRejectVerdit()

    const { isReporting, handleReportIssue } = useReportIssue()
    const { isFloorPlanUploading, handleFloorPlanSubmission } = useUploadFloorPlan()
    const [chatOpen, setChatOpen] = useState(false)
    const [approveProposal, setApproveProposal] = useState<{ sourceId: string } | null>(null)

    const [rejectProposal, setRejectProposal] = useState<{ sourceId: string } | null>(null)
    const [review, setReview] = useState<{ sourceId: string } | null>(null)
    const [dispute, setDispute] = useState<{ sourceId: string } | null>(null)
    const [uploadFloorPlan, setUploadFloorPlan] = useState<string | null>(null)
    const [updateFloorPlan, setUpdateFloorPlan] = useState<string | null>(null)
    const [uploadingService, setUploadingService] = useState<{
        sourceId: string;
        serviceNumber: number;
        serviceName: string
    } | null>(null)

    const [payingService, setPayingService] = useState<{ serviceName: string; amount: number } | null>(null)

    const activeDispute = disputedData

    const handleVerdit = async (data: AcceptOrRejectDisputeDTO) => {
        await handleVerditSubmit(data)
    }

    const handleApprovalProposal = async () => {
        if (!approveProposal) return
        const result = await handleUpdateStatus({ sourceId: approveProposal.sourceId, contractStatus: "Accepted" })
        handleResponse(result.success, "You have accepted the contract", result.message)
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

    const handleApproveVersion = async () => {
        if (!approveVersion) return
        const result = await handleVersionApprovalOrRejection({ status: "Approved", versionId: approveVersion })
        handleResponse(result.success, "You have approved this version.", result.message)
        setApproveVersion(null)
    }

    const handleRejectVersion = async (data: RejectionPayload) => {
        if (!rejectVersion) return
        const result = await handleVersionApprovalOrRejection({ versionId: rejectVersion, status: "Rejected", rejectionReason: data.rejectionReason })
        handleResponse(result.success, "You have reject this version.", result.message)
        setRejectVersion(null)
    }

    const handleUploadSubmit = async (data: IServiceResult) => {
        if (!uploadingService) return
        console.log(uploadingService)
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
        handleResponse(result.success, "Upload successfull", result.message)

        setUploadingService(null)
    }

    const handleRejection = async ({ rejectionReason }: RejectionPayload) => {
        if (!rejectProposal) return
        const result = await handleUpdateStatus({
            sourceId: rejectProposal.sourceId,
            contractStatus: "Rejected",
            overallRejectionReason: rejectionReason
        })
        handleResponse(result.success, "You have rejected the contract", result.message)
        setRejectProposal(null)
    }

    const handleWriteReveiw = async (data: ReviewPayloadFields) => {
        if (!review) return
        const result = await handleWriteReview({ sourceId: review.sourceId, comment: data.comment, rating: data.rating })
        handleResponse(result.success, "Your reveiw was successfully submitted", result.message)
        setReview(null)
    }

    const handlFloorPlan = async (data: FloorPlans) => {
        if (!uploadFloorPlan) return
        const formData = new FormData();
        formData.append("proposalId", uploadFloorPlan)
        data.floorPlans.forEach(item => {
            const file = item.file?.[0]
            if (file) {
                formData.append("floorPlans", file)
            }
        })

        const result = await handleFloorPlanSubmission(formData)
        handleResponse(result.success, "Floor Plan Uploaded", result.message)
        setUploadFloorPlan(null)
    }
    const handleUpdateFloorPlan = async (data: FloorPlans) => {
        if (!updateFloorPlan) return
        const formData = new FormData();
        formData.append("proposalId", updateFloorPlan)
        data.floorPlans.forEach(item => {
            const file = item.file?.[0]
            if (file) {
                formData.append("floorPlans", file)
            }
        })

        const result = await handleFloorPlanSubmission(formData)
        handleResponse(result.success, "Floor Plan updated", result.message)
        setUpdateFloorPlan(null)
    }

    const handleRaiseIssue = async (data: DisputeFormDTO) => {
        if (!dispute) return

        const service = proposal?.services.find((e) =>
            ["Open", "In Progress", "Uploaded", "Redo"].includes(e.status)
        );

        if (!service || !proposal?.sourceId) {
            handleResponse(false, "", "Unable to submit — missing service or proposal information")
            return
        }

        const formData = new FormData();
        formData.append("reason", data.reason)
        formData.append("type", data.type.label)
        formData.append("order", `${service.order}`)
        formData.append("sourceId", proposal.sourceId)
        data.evidence.forEach(item => {
            const file = item.file?.[0]
            if (file) {
                formData.append("evidence", file)
            }
        })

        const result = await handleReportIssue(formData)
        handleResponse(result.success, "The issue has been noted", result.message)
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
        if (result.success) {
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
                    ? <NoProposalDesigner activeJobId={activeJobId} jobId={id!} sourceType={sourceType!} sourceId={sourceId!} />
                    : <NoProposalCustomer activeJobId={activeJobId!} />
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
                onConfirm={handleApprovalProposal}
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
            <UploadFloorPlan
                isOpen={!!uploadFloorPlan}
                onClose={() => setUploadFloorPlan(null)}
                onConfirm={handlFloorPlan}
                isLoading={isFloorPlanUploading}
                title="upload"
            />
            <UploadFloorPlan
                isOpen={!!updateFloorPlan}
                onClose={() => setUpdateFloorPlan(null)}
                onConfirm={handleUpdateFloorPlan}
                isLoading={isFloorPlanUploading}
                title="upload"
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
                sourceId={sourceId}
                role={role}
                showUpdateProposal={showUpdateProposal}
                onChatOpen={() => setChatOpen(true)}
            />
            <ConfirmModal
                isOpen={!!approveVersion}
                onConfirm={handleApproveVersion}
                onClose={() => setApproveVersion(null)}
                isLoading={isVersionApprovingOrRejecting}
                text="Are you sure you want to accept this request?"
                heading="Confirm?"
                buttonLoadingText="Accepting"
                buttonText="Confirm & Accept"
            />

            <RejectJobApplicationModal
                isOpen={!!rejectVersion}
                onClose={() => setRejectVersion(null)}
                onConfirm={handleRejectVersion}
                isLoading={isVersionApprovingOrRejecting}
            />

            {
                contractStatus === "Completed" && role === "Customer" && (
                    <div>
                        <button onClick={() => setReview({ sourceId: proposal.sourceId })} className="soft-black-button">
                            Write Your Review
                        </button>
                    </div>
                )
            }

            {
                proposal.contractStatus !== "Sent" && proposal.siteVisitingRequired && proposal.floorPlans?.length === 0 && role === "Designer" && (
                    <div>
                        <button onClick={() => setUploadFloorPlan(proposal.id)} className="soft-black-button">
                            Upload Floor plan
                        </button>
                    </div>
                )
            }
            {
                proposal.contractStatus !== "Sent" && proposal.siteVisitingRequired && proposal.floorPlans && proposal.floorPlans.length > 0 && role === "Designer" && (
                    <div>
                        <button onClick={() => setUpdateFloorPlan(proposal.id)} className="soft-black-button">
                            Update Floor plan
                        </button>
                    </div>
                )
            }

            <div>
                <button onClick={() => setDispute({ sourceId: proposal.sourceId })} className="soft-black-button">
                    Raise a Issue
                </button>
            </div>

            {showProposalActions && (
                <CustomerActionPanel
                    onAccept={() => setApproveProposal({ sourceId: proposal.sourceId })}
                    onDecline={() => setRejectProposal({ sourceId: proposal.sourceId })}
                />
            )}

            {contractStatus === "Disputed" && activeDispute && (
                <DisputeCard dispute={activeDispute} isResponding={isChecking} onConfirm={handleVerdit} role={role} />
            )}

            <ContractOverview proposal={proposal} />

            {proposal.floorPlans && proposal.floorPlans.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
                    <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black mb-3">Floor Plans</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {proposal.floorPlans.map((url, index) => (
                            <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                                </div>
                                <span className="text-sm text-gray-700 flex-1 truncate">Floor Plan {index + 1}.pdf</span>
                                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                            </a>
                        ))}
                    </div>
                </div>
            )}
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
                                onVerify={(versionId) => setApproveVersion(versionId)}
                                onRedo={(versionId) => setRejectVersion(versionId)}
                                onUpload={() => handleUpload(service.order, service.serviceName)}
                                isPayLoading={ispaymentDataLoading && payingService?.serviceName === service.serviceName}
                            />
                        ))}
                </div>
            </div>
        </div>
    )
}