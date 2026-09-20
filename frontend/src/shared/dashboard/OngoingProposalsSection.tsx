import { useNavigate } from "react-router-dom"
import { Briefcase } from "lucide-react"
import type { OngoingProposalDTOs } from "../../features/designer/dashboard/dashboardInterface"

const statusStyles: Record<OngoingProposalDTOs["status"], string> = {
    Locked: "bg-surface-hover text-text-faint border border-surface-border",
    Open: "bg-accent-tint text-accent-tint-text border border-surface-border",
    "In Progress": "bg-accent-tint text-accent-tint-text border border-surface-border",
    Uploaded: "bg-success-tint text-success-text border border-surface-border",
    Redo: "bg-warning-tint text-warning-text border border-surface-border",
    Completed: "bg-success-tint text-success-text border border-surface-border",
}

const paymentStyles: Record<OngoingProposalDTOs["paymentStatus"], string> = {
    Pending: "bg-warning-tint text-warning-text border border-surface-border",
    Paid: "bg-success-tint text-success-text border border-surface-border",
    Refunded: "bg-error-tint text-error-text border border-surface-border",
}

type Props = {
    proposals: OngoingProposalDTOs[]
    role: "Customer" | "Designer" | "Admin" | null
}

export default function OngoingProposalsSection({ proposals, role }: Props) {
    const navigate = useNavigate()


    const viewProposal = (proposal: OngoingProposalDTOs) => {
        const basePath = role === "Designer" ? "/designer/proposal" : "/customer/proposal"
        navigate(`${basePath}/${proposal.jobId}`, {
            state: {
                sourceType: proposal.sourceType === "JOB_REQUEST" ? "jobRequest" : "direct_hire",
                activeJobId: proposal.activeJobId,
                sourceId: proposal.jobId,
            },
        })
    }

    return (
        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <Briefcase size={20} className="text-accent" />
                <p className="text-base font-semibold text-text-primary">Ongoing proposals</p>
            </div>

            {proposals.length === 0 ? (
                <p className="text-sm text-text-faint">No active proposals right now.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {proposals.map((proposal) => (
                        <li
                            key={proposal.proposalId}
                            onClick={() => viewProposal(proposal)}
                            className="flex items-center justify-between gap-3 border-b border-surface-border last:border-b-0 pb-3 last:pb-0 cursor-pointer"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">{proposal.jobName}</p>
                                <p className="text-xs text-text-faint truncate">{proposal.serviceName}</p>
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