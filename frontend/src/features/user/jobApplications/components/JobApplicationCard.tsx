import { ArrowUpRight, User } from "lucide-react"
import type { AllJobApplicationsDTO, JobApplicationStatus } from "../jobApplicationInterFace";
import { useNavigate } from "react-router-dom";

type Props = {
    application: AllJobApplicationsDTO
    onApprove: () => void
    onReject: () => void
}

const statusStyles: Record<JobApplicationStatus, string> = {
    Pending: "bg-warning-tint text-warning-text border-warning-tint",
    Approved: "bg-success-tint text-success-text border-success-tint",
    Rejected: "bg-error-tint text-error border-error-tint",
    Ongoing: "bg-accent-tint text-accent-tint-text border-accent-tint",
}

export default function JobApplicationCard({ application, onApprove, onReject }: Props) {
    const { status, rejectionReason, jobTitle, designerName, propertyType, timeLine, createdOn, designerId, jobId } = application

    const isActionable = status === "Pending"
    const navigate = useNavigate()

    return (
        <div className="group bg-surface w-full rounded-xl border border-surface-border overflow-hidden hover:border-accent transition-colors duration-300">
            <div className="px-4 pt-4 pb-4 flex flex-col gap-2 h-full">

                <div className="flex items-center justify-between gap-2">
                    <span className="text-xxs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-surface-hover text-text-primary border border-surface-border truncate">
                        {propertyType}
                    </span>
                    <span className={`text-xxs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[status]}`}>
                        {status}
                    </span>
                </div>

                <div>
                    <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-surface-hover text-text-faint border border-surface-border">
                        {timeLine}
                    </span>
                </div>

                <h3 onClick={() => navigate(`/jobs/${jobId}`)} className="text-md font-semibold leading-snug text-text-primary hover:text-accent-hover transition-colors duration-200 cursor-pointer truncate mt-1">
                    {jobTitle}
                </h3>
                <p className="text-xxs text-text-muted">{createdOn}</p>

                {status === "Rejected" && rejectionReason && (
                    <div className="bg-error-tint border-l-2 border-error rounded px-3 py-2 mt-2">
                        <p className="text-xxs font-semibold uppercase tracking-wide text-error mb-0.5">Rejection reason</p>
                        <p className="text-xs text-error leading-relaxed">{rejectionReason}</p>
                    </div>
                )}

                <div className="mt-auto pt-3">
                    <div className="h-px bg-surface-border mb-3" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center">
                            <User className="w-4 h-4 text-text-faint" />
                        </div>
                        <div>
                            <p className="text-[12px] font-semibold text-text-primary leading-tight truncate">{designerName}</p>
                        </div>
                        <button onClick={() => navigate(`/designers/${designerId}`)} className="ml-auto" aria-label="View designer">
                            <ArrowUpRight size={16} className="text-text-faint hover:text-accent transition-colors duration-200" />
                        </button>
                    </div>

                    {status === "Pending" && (
                        <div className="flex gap-2 mt-4">
                            <button
                                disabled={!isActionable}
                                onClick={onApprove}
                                className="flex-1 text-xxs font-semibold tracking-widest uppercase py-1.5 rounded-lg border transition-colors duration-150 bg-success-tint text-success border-success-tint hover:border-success disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ✓ Approve
                            </button>
                            <button
                                disabled={!isActionable}
                                onClick={onReject}
                                className="flex-1 text-xxs font-semibold tracking-widest uppercase py-1.5 rounded-lg border transition-colors duration-150 bg-error-tint text-error border-error-tint hover:border-error disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ✕ Reject
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}