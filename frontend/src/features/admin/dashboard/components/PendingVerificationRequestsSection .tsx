import { UserCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { PendingVerificationRequests } from "../adminDashboardInterface"

type Props = {
    requests: PendingVerificationRequests[]
}

export default function PendingVerificationRequestsSection({ requests }: Props) {
    const navigate = useNavigate()

    const handleView = (request: PendingVerificationRequests) => {
        navigate(`/admin/designer-requests/${request.id}`)
    }

    return (
        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <UserCheck size={20} className="text-accent" />
                <p className="text-base font-semibold text-text-primary">Designer verification requests</p>
            </div>

            {requests.length === 0 ? (
                <p className="text-sm text-text-faint">No pending requests.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {requests.map((request) => (
                        <li
                            key={request.id}
                            className="flex items-center justify-between gap-3 border-b border-surface-border last:border-b-0 pb-3 last:pb-0"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">{request.name}</p>
                                <p className="text-xs text-text-faint truncate">{request.email}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-warning-tint text-warning-text border border-surface-border">
                                    {request.status}
                                </span>
                                <button
                                    onClick={() => handleView(request)}
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