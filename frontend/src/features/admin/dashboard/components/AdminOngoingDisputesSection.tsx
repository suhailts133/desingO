import { AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { AdminOngoingDisputeDTOs } from "../adminDashboardInterface"

const statusStyles: Record<AdminOngoingDisputeDTOs["status"], string> = {
    Open: "bg-warning-tint text-warning-text border border-surface-border",
    Redo: "bg-accent-tint text-accent-tint-text border border-surface-border",
}

type Props = {
    disputes: AdminOngoingDisputeDTOs[]
}

export default function AdminOngoingDisputesSection({ disputes }: Props) {
    const navigate = useNavigate()

    const handleResolve = (dispute: AdminOngoingDisputeDTOs) => {
        navigate(`/admin/disputes/${dispute.id}`)
    }

    return (
        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <AlertTriangle size={20} className="text-error" />
                <p className="text-base font-semibold text-text-primary">Ongoing disputes</p>
            </div>

            {disputes.length === 0 ? (
                <p className="text-sm text-text-faint">No disputes right now.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {disputes.map((dispute) => (
                        <li
                            key={dispute.id}
                            className="flex items-center justify-between gap-3 border-b border-surface-border last:border-b-0 pb-3 last:pb-0"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">{dispute.type}</p>
                                <p className="text-xs text-text-faint truncate">{dispute.reason}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[dispute.status]}`}>
                                    {dispute.status}
                                </span>
                                <button
                                    onClick={() => handleResolve(dispute)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent text-text-on-accent hover:bg-accent-hover"
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