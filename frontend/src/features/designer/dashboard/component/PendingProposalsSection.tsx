import { useNavigate } from "react-router-dom"
import { Clock, ExternalLink } from "lucide-react"
import type { PendingProposalDTOs } from "../dashboardInterface"

const sourceLabel: Record<PendingProposalDTOs["sourceType"], string> = {
    jobRequest: "Job request",
    direct_hire: "Direct hire",
}

const statusLabel: Record<PendingProposalDTOs["proposalStatus"], string> = {
    NOT_CREATED: "Create proposal",
    CREATED: "View proposal",
    REJECTED: "View proposal",
}

const statusStyles: Record<PendingProposalDTOs["proposalStatus"], string> = {
    NOT_CREATED: "bg-warning-tint text-warning-text border border-warning-tint hover:border-warning",
    CREATED: "bg-accent-tint text-accent-tint-text border border-accent-tint hover:border-accent",
    REJECTED: "bg-error-tint text-error border border-error-tint hover:border-error",
}

type Props = {
    proposals: PendingProposalDTOs[]
}

export default function PendingProposalsSection({ proposals }: Props) {
    const navigate = useNavigate()

    const goToJobDetail = (job: PendingProposalDTOs) => {
        navigate(`/jobs/${job.sourceId}`)
    }

    const goToProposal = (job: PendingProposalDTOs) => {
        if (job.proposalStatus === "NOT_CREATED") {
            navigate(`/designer/proposal/create/${job.sourceId}`, {
                state: { sourceType: job.sourceType, sourceId: job.sourceId },
            })
            return
        }

        navigate(`/designer/proposal/${job.sourceId}`, {
            state: {
                activeJobId: job.activeJobId,
                sourceType: job.sourceType,
                sourceId: job.sourceId,
            },
        })
    }

    return (
        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <Clock size={20} className="text-accent" />
                <p className="text-base font-semibold text-text-primary">Active Jobs</p>
            </div>

            {proposals.length === 0 ? (
                <p className="text-sm text-text-faint">Nothing needs your attention here.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {proposals.map((job) => (
                        <li
                            key={job.sourceId}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border last:border-b-0 pb-3 last:pb-0"
                        >
                            <button
                                onClick={() => goToJobDetail(job)}
                                className="flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-accent-hover transition-colors text-left truncate group"
                            >
                                <span className="truncate">{job.jobName}</span>
                                <ExternalLink size={14} className="shrink-0 text-text-faint group-hover:text-accent-hover transition-colors" />
                            </button>

                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-surface-hover text-text-primary border border-surface-border">
                                    {sourceLabel[job.sourceType]}
                                </span>
                                <button
                                    onClick={() => goToProposal(job)}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${statusStyles[job.proposalStatus]}`}
                                >
                                    {statusLabel[job.proposalStatus]}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}