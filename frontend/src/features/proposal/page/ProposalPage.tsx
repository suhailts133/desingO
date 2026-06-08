import { useState } from "react"
import { useParams, useLocation } from "react-router-dom"
import { useGetProposalQuery } from "../proposalEndpoints"
import { useDecodeAccessToken } from "../../../helpers/decodeAccessToken"

import type { ReviewPayloadFields } from "../proposalInterface"
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

export default function ProposalPage() {
    const { id } = useParams<{ id: string }>()
    const { role } = useDecodeAccessToken()
    const location = useLocation()

    const sourceType = location.state?.sourceType as "jobRequest" | "direct_hire" | undefined
    const sourceId = location.state?.sourceId as string | undefined
    const activeJobId = location.state?.activeJobId as string | undefined

    const { data, isLoading, error } = useGetProposalQuery(id!, { skip: !id })
    const { isChangingStatus, statusUpdateError, statusUpdateSuccess, newStatus, handleUpdateStatus } = useApproveOrReject()
    const { isReviewing, reviewError, reivewSuccess, handleWriteReview } = useWriteReview()

    const [chatOpen, setChatOpen] = useState(false)
    const [approveProposal, setApproveProposal] = useState<{ sourceId: string } | null>(null)
    const [rejectProposal, setRejectProposal] = useState<{ sourceId: string } | null>(null)
    const [review, setReview] = useState<{ sourceId: string } | null>(null)

    const handleApproval = async () => {
        if (!approveProposal) return
        await handleUpdateStatus({ sourceId: approveProposal.sourceId, contractStatus: "Accepted" })
        setApproveProposal(null)
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

    if (!role) {
        return <div className="p-10 text-center text-red-500 font-Jost-Semibold">Invalid proposal source.</div>
    }
    if(!activeJobId){
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

    const proposal = data?.data
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



    const contractStatus = newStatus ?? proposal.contractStatus
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

            <ChatPanel
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                activeJobId={activeJobId}
                otherPersonName={"other"}
                role={role}
            />


            <ProposalHeader
                id={id!}
                status={contractStatus}
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


            {showProposalActions && (
                <CustomerActionPanel
                    onAccept={() => setApproveProposal({ sourceId: proposal.sourceId })}
                    onDecline={() => setRejectProposal({ sourceId: proposal.sourceId })}
                    statusUpdateError={statusUpdateError}
                    statusUpdateSuccess={statusUpdateSuccess}
                />
            )}


            <ContractOverview proposal={proposal} />




            {proposal.overallRejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
                    <p className="text-xs font-Jost-Semibold text-red-700 uppercase tracking-widest mb-1">Rejection reason</p>
                    <p className="text-sm text-red-700">{proposal.overallRejectionReason}</p>
                </div>
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
                                onPay={() => { }}
                                onVerify={() => { }}
                                onRedo={() => { }}
                                onUpload={() => { }}
                            />
                        ))}
                </div>
            </div>
        </div>
    )
}