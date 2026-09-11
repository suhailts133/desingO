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
        <div className="bg-off-white rounded-2xl border border-blush-light/40 shadow-lg px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <UserCheck size={20} className="text-blush-deep" />
                <p className="text-base font-semibold text-soft-black">Designer verification requests</p>
            </div>

            {requests.length === 0 ? (
                <p className="text-sm text-soft-black/40">No pending requests.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {requests.map((request) => (
                        <li
                            key={request.id}
                            className="flex items-center justify-between gap-3 border-b border-blush-light/30 last:border-b-0 pb-3 last:pb-0"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-soft-black truncate">{request.name}</p>
                                <p className="text-xs text-soft-black/50 truncate">{request.email}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                    {request.status}
                                </span>
                                <button
                                    onClick={() => handleView(request)}
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