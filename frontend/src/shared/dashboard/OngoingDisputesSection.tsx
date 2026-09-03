import { AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { OngoingDisputeDTOs } from "../../features/designer/dashboard/dashboardInterface"

const statusStyles: Record<OngoingDisputeDTOs["status"], string> = {
    Open: "bg-amber-50 text-amber-700 border border-amber-200",
    "Under Review": "bg-blue-50 text-blue-700 border border-blue-200",
    Resolved: "bg-green-50 text-green-800 border border-green-200",
    Redo: "bg-purple-50 text-purple-700 border border-purple-200",
    "Awaiting Confirmation": "bg-orange-50 text-orange-700 border border-orange-200",
}

type Props = {
    disputes: OngoingDisputeDTOs[]
    role: "Customer" | "Designer" | "Admin" | null
}

export default function OngoingDisputesSection({ disputes, role }: Props) {
    const navigate = useNavigate()
    const handleResolve = (dispute: OngoingDisputeDTOs) => {
        const basePath = role === "Designer" ? "/designer/proposal" : "/customer/proposal"
        navigate(`${basePath}/${dispute.sourceId}`, {
            state: {
                activeJobId: dispute.activeJobId,
                sourceType: dispute.sourceType,
                sourceId: dispute.sourceId,
            },
        })
    }

    return (
        <div className="bg-off-white rounded-2xl border border-blush-light/40 shadow-lg px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <AlertTriangle size={20} className="text-error" />
                <p className="text-base font-semibold text-soft-black">Ongoing disputes</p>
            </div>

            {disputes.length === 0 ? (
                <p className="text-sm text-soft-black/40">No disputes right now.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {disputes.map((dispute) => (
                        <li
                            key={dispute.proposalId}
                            className="flex items-center justify-between gap-3 border-b border-blush-light/30 last:border-b-0 pb-3 last:pb-0"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-soft-black truncate">{dispute.type}</p>
                                <p className="text-xs text-soft-black/50 truncate">{dispute.reason}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[dispute.status]}`}>
                                    {dispute.status}
                                </span>
                                <button
                                    onClick={() => handleResolve(dispute)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blush-deep text-off-white hover:opacity-90"
                                >
                                    View
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}