import { useState } from "react"
import { AlertCircle, User, Hash, Check, X, AlertTriangle } from "lucide-react"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"
import type { AcceptOrRejectDisputeDTO, DisputeResponseDTO } from "../proposalInterface"
import ConfirmModal from "../../../shared/modals/ConfirmModal"

const disputeStatusStyle: Record<DisputeResponseDTO["status"], string> = {
    "Open": "bg-error-tint text-error-text border-error",
    "Under Review": "bg-accent-tint text-accent-tint-text border-surface-border",
    "Resolved": "bg-success-tint text-success-text border-success",
    "Redo": "bg-warning-tint text-warning-text border-warning",
    "Awaiting Confirmation": "bg-surface-hover text-text-primary border-accent",
    "Terminated": "bg-surface-hover text-text-faint border-surface-border",
};
const raisedByStyle: Record<DisputeResponseDTO["raisedBy"], string> = {
    "Customer": "bg-accent-tint text-accent-tint-text border-surface-border",
    "Designer": "bg-surface-hover text-text-faint border-surface-border",
}

interface DisputeCardProps {
    dispute: DisputeResponseDTO
    onConfirm: (data: AcceptOrRejectDisputeDTO) => void
    isResponding: boolean,
    role: "Customer" | "Designer" | "Admin" | null
}

export default function DisputeCard({ dispute, onConfirm, isResponding, role }: DisputeCardProps) {
    const [expanded, setExpanded] = useState(false)
    const [approveDispute, setApproveDispute] = useState<string | null>(null)
    const [rejectDispute, setRejectDispute] = useState<string | null>(null)
    const [terminateDispue, setTerminateDispute] = useState<string | null>(null)

    const handleDisputeTermination = () => {
        if (!terminateDispue) return
        onConfirm({ status: "Terminated", disputeId: dispute.id })
        setTerminateDispute(null)
    }
    const handleDisputeApproval = () => {
        if (!approveDispute) return
        onConfirm({ status: "Resolved", disputeId: dispute.id })
        setApproveDispute(null)
    }
    const handleDisputeRejection = () => {
        if (!rejectDispute) return
        onConfirm({ status: "Redo", disputeId: dispute.id })
        setRejectDispute(null)
    }
    return (


        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5 flex flex-col gap-4">


            <ConfirmModal
                isOpen={!!terminateDispue}
                onConfirm={handleDisputeTermination}
                onClose={() => setTerminateDispute(null)}
                isLoading={isResponding}
                heading="Accept and Terminate?"
                text="his action is final. Accepting will permanently terminate the contract and release any authorized refunds. This cannot be undone."
                buttonText="Confirm & Terminate"
                buttonLoadingText="Terminate…"
            />
            <ConfirmModal
                isOpen={!!approveDispute}
                onConfirm={handleDisputeApproval}
                onClose={() => setApproveDispute(null)}
                isLoading={isResponding}
                heading="Accept this Verdit?"
                text="Once accepted, this Action cannot be done."
                buttonText="Confirm & accept"
                buttonLoadingText="Accepting…"
            />
            <ConfirmModal
                isOpen={!!rejectDispute}
                onConfirm={handleDisputeRejection}
                onClose={() => setRejectDispute(null)}
                isLoading={isResponding}
                heading="Accept this proposal?"
                text="Once Reject, This action cannot be undone."
                buttonText="Confirm & Reject"
                buttonLoadingText="Rejecting…"
            />

            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-error" />
                    <span className="font-Jost-Semibold text-sm text-text-primary">Dispute</span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${disputeStatusStyle[dispute.status]}`}>
                        {dispute.status}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full border ${raisedByStyle[dispute.raisedBy]}`}>
                        <User className="w-3 h-3" />
                        Raised by {dispute.raisedBy}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-text-faint">
                        <Hash className="w-3 h-3" />
                        Service {dispute.serviceOrder}
                    </span>
                </div>
            </div>

            <div>
                <p className="text-xs font-Jost-Semibold text-text-faint uppercase tracking-widest mb-1">Reason</p>
                <p className="text-sm text-text-primary">{dispute.reason}</p>
            </div>

            {dispute.evidence.length > 0 && (
                <div>
                    <p className="text-xs font-Jost-Semibold text-text-faint uppercase tracking-widest mb-2">
                        Evidence ({dispute.evidence.length})
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {dispute.evidence.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-surface-hover border border-surface-border">
                                <Zoom>
                                    <img
                                        src={url}
                                        className="w-full h-full object-cover"
                                        alt={`dispute-evidence-${index}`}
                                    />
                                </Zoom>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(dispute.resolution || dispute.resolutionType) && (
                <div className="bg-success-tint border border-success rounded-xl px-4 py-3">
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="text-xs font-Jost-Semibold text-success-text uppercase tracking-widest"
                    >
                        Resolution {dispute.resolutionType ? `· ${dispute.resolution}` : ""}
                    </button>
                    {dispute.resolution && (expanded || !dispute.evidence.length) && (
                        <p className="text-sm text-success-text mt-1">{dispute.resolution}</p>
                    )}
                </div>
            )}

            {dispute.status === "Awaiting Confirmation" && dispute.raisedBy === role && (
                <div className="flex items-center gap-3 pt-1">
                    <button
                        type="button"
                        onClick={() => setApproveDispute(dispute.id)}
                        disabled={isResponding}
                        className="inline-flex items-center gap-2 text-xs font-Jost-Semibold px-4 py-2 rounded-lg bg-success text-text-primary hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        <Check className="w-3.5 h-3.5" />
                        Confirm Resolution
                    </button>
                    <button
                        type="button"
                        onClick={() => setRejectDispute(dispute.id)}
                        disabled={isResponding}
                        className="inline-flex items-center gap-2 text-xs font-Jost-Semibold px-4 py-2 rounded-lg border border-error text-error hover:bg-error-tint transition-all disabled:opacity-50"
                    >
                        <X className="w-3.5 h-3.5" />
                        Contest Resolution
                    </button>

                    <button
                        type="button"
                        onClick={() => setTerminateDispute(dispute.id)}
                        disabled={isResponding}
                        className="inline-flex items-center gap-2 text-xs font-Jost-Semibold px-4 py-2 rounded-lg bg-error text-text-primary hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Accept & Terminate
                    </button>
                </div>
            )}




        </div>



    )
}