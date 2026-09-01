import { useNavigate } from "react-router-dom"
import { Briefcase } from "lucide-react"
import type { OngoingProposalDTOs } from "../dashboardInterface"

const statusStyles: Record<OngoingProposalDTOs["status"], string> = {
    Locked: "bg-gray-100 text-gray-700 border border-gray-200",
    Open: "bg-blue-50 text-blue-700 border border-blue-200",
    "In Progress": "bg-amber-50 text-amber-700 border border-amber-200",
    Uploaded: "bg-purple-50 text-purple-700 border border-purple-200",
    Redo: "bg-red-50 text-red-700 border border-red-200",
    Completed: "bg-green-50 text-green-800 border border-green-200",
}

const paymentStyles: Record<OngoingProposalDTOs["paymentStatus"], string> = {
    Pending: "bg-amber-50 text-amber-700 border border-amber-200",
    Paid: "bg-green-50 text-green-800 border border-green-200",
    Refunded: "bg-red-50 text-red-700 border border-red-200",
}

type Props = {
    proposals: OngoingProposalDTOs[]
}

export default function OngoingProposalsSection({ proposals }: Props) {
    const navigate = useNavigate()

    const viewProposal = (proposal: OngoingProposalDTOs) => {
        navigate(`/designer/proposal/${proposal.jobId}`, {
            state: {
                sourceType: proposal.sourceType === "JOB_REQUEST" ? "jobRequest" : "direct_hire",
                activeJobId: proposal.activeJobId,
                sourceId: proposal.jobId,
            },
        })
    }

    return (
        <div className="bg-off-white rounded-2xl border border-blush-light/40 shadow-lg px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <Briefcase size={20} className="text-blush-deep" />
                <p className="text-base font-semibold text-soft-black">Ongoing proposals</p>
            </div>

            {proposals.length === 0 ? (
                <p className="text-sm text-soft-black/40">No active proposals right now.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {proposals.map((proposal) => (
                        <li
                            key={proposal.proposalId}
                            onClick={() => viewProposal(proposal)}
                            className="flex items-center justify-between gap-3 border-b border-blush-light/30 last:border-b-0 pb-3 last:pb-0 cursor-pointer"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-soft-black truncate">{proposal.jobName}</p>
                                <p className="text-xs text-soft-black/50 truncate">{proposal.serviceName}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[proposal.status]}`}>
                                    {proposal.status}
                                </span>
                                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${paymentStyles[proposal.paymentStatus]}`}>
                                    {proposal.paymentStatus}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}