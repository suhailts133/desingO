import { useState } from "react"
import { AlertCircle, User, Hash, Check, X } from "lucide-react"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"
import type { AcceptOrRejectDisputeDTO, DisputeResponseDTO } from "../proposalInterface"
import ConfirmModal from "../../../shared/modals/ConfirmModal"

const disputeStatusStyle: Record<DisputeResponseDTO["status"], string> = {
    "Open": "bg-red-50 text-red-700 border-red-200",
    "Under Review": "bg-blue-50 text-blue-700 border-blue-200",
    "Resolved": "bg-green-50 text-green-700 border-green-200",
    "Redo": "bg-amber-50 text-amber-700 border-amber-200",
    "Awaiting Confirmation": "bg-purple-50 text-purple-700 border-purple-200",
}

const raisedByStyle: Record<DisputeResponseDTO["raisedBy"], string> = {
    "Customer": "bg-blush-pale text-blush-deep border-blush-light/50",
    "Designer": "bg-gray-50 text-gray-700 border-gray-200",
}

interface DisputeCardProps {
    dispute: DisputeResponseDTO
    onConfirm: (data: AcceptOrRejectDisputeDTO) => void
    isResponding: boolean,
    role: "Customer" | "Designer" | "Admin" | null
}

export default function DisputeCard({ dispute, onConfirm, isResponding ,role}: DisputeCardProps) {
    const [expanded, setExpanded] = useState(false)
    const [approveDispute, setApproveDispute] = useState<string | null>(null)
    const [rejectDispute, setRejectDispute] = useState<string | null>(null)

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


        <div className="bg-white rounded-2xl border border-blush-light/40 shadow-sm px-6 py-5 flex flex-col gap-4">


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
                text="Once Reject,  This action cannot be undone."
                buttonText="Confirm & Reject"
                buttonLoadingText="Rejecting…"
            />

            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="font-Jost-Semibold text-sm text-soft-black">Dispute</span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${disputeStatusStyle[dispute.status]}`}>
                        {dispute.status}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full border ${raisedByStyle[dispute.raisedBy]}`}>
                        <User className="w-3 h-3" />
                        Raised by {dispute.raisedBy}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-soft-black/40">
                        <Hash className="w-3 h-3" />
                        Service {dispute.serviceOrder}
                    </span>
                </div>
            </div>

            <div>
                <p className="text-xs font-Jost-Semibold text-soft-black/40 uppercase tracking-widest mb-1">Reason</p>
                <p className="text-sm text-soft-black">{dispute.reason}</p>
            </div>

            {dispute.evidence.length > 0 && (
                <div>
                    <p className="text-xs font-Jost-Semibold text-soft-black/40 uppercase tracking-widest mb-2">
                        Evidence ({dispute.evidence.length})
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {dispute.evidence.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
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
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="text-xs font-Jost-Semibold text-green-700 uppercase tracking-widest"
                    >
                        Resolution {dispute.resolutionType ? `· ${dispute.resolution}` : ""}
                    </button>
                    {dispute.resolution && (expanded || !dispute.evidence.length) && (
                        <p className="text-sm text-green-700 mt-1">{dispute.resolution}</p>
                    )}
                </div>
            )}

            {dispute.status === "Awaiting Confirmation" && dispute.raisedBy === role && (
                <div className="flex items-center gap-3 pt-1">
                    <button
                        type="button"
                        onClick={() => setApproveDispute(dispute.id)}
                        disabled={isResponding}
                        className="inline-flex items-center gap-2 text-xs font-Jost-Semibold px-4 py-2 rounded-lg bg-success text-white hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        <Check className="w-3.5 h-3.5" />
                        Confirm Resolution
                    </button>
                    <button
                        type="button"
                        onClick={() => setRejectDispute(dispute.id)}
                        disabled={isResponding}
                        className="inline-flex items-center gap-2 text-xs font-Jost-Semibold px-4 py-2 rounded-lg border border-red-200 text-error hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                        <X className="w-3.5 h-3.5" />
                        Contest Resolution
                    </button>
                </div>
            )}




        </div>



    )
}