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
    NOT_CREATED: "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
    CREATED: "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100",
    REJECTED: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
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
        <div className="bg-off-white rounded-2xl border border-blush-light/40 shadow-lg px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <Clock size={20} className="text-blush-deep" />
                <p className="text-base font-semibold text-soft-black">Pending proposals</p>
            </div>

            {proposals.length === 0 ? (
                <p className="text-sm text-soft-black/40">Nothing needs your attention here.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {proposals.map((job) => (
                        <li
                            key={job.sourceId}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blush-light/30 last:border-b-0 pb-3 last:pb-0"
                        >
                            <button
                                onClick={() => goToJobDetail(job)}
                                className="flex items-center gap-1.5 text-sm font-medium text-blush-deep hover:underline text-left truncate group"
                            >
                                <span className="truncate">{job.jobName}</span>
                                <ExternalLink size={14} className="shrink-0 opacity-60 group-hover:opacity-100" />
                            </button>

                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blush-pale text-blush-deep border border-blush-light/60">
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