import { ArrowUpRight, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { HireDesignerDTO } from "../designInterface"

type Status = HireDesignerDTO["status"]

type Props = {
    request: HireDesignerDTO
    onApprove: () => void
    onReject: () => void
}

const statusStyles: Record<Status, string> = {
    Pending: "bg-warning-tint text-warning-text border-warning-tint",
    Ongoing: "bg-accent-tint text-accent-tint-text border-accent-tint",
    Accepted: "bg-success-tint text-success-text border-success-tint",
    Rejected: "bg-error-tint text-error border-error-tint",
    Closed: "bg-surface-hover text-text-faint border-surface-border",
}

export default function HireRequestCard({ request, onApprove, onReject }: Props) {
    const { id, userName, profileImage, projectTitle, projectType, totalArea, rooms, areaUnit, minBudget, maxBudget, timeLine, createdAt, status, rejectionReason, } = request

    const isActionable = status === "Pending"
    const navigate = useNavigate()

    const formattedArea = `${totalArea} ${areaUnit}² · ${rooms} ${rooms === 1 ? "Room" : "Rooms"}`
    const formattedBudget = `₹${minBudget?.toLocaleString()} - ₹${maxBudget?.toLocaleString()}`

    return (
        <div
            onClick={() => navigate(`/jobs/${id}`)}
            className="group bg-surface w-full rounded-xl border border-surface-border overflow-hidden hover:border-accent transition-colors duration-300 cursor-pointer"
        >
            <div className="px-4 pt-4 pb-4 flex flex-col gap-2.5 h-full">

                {/* Header: Area/Rooms & Status */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xxs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-surface-hover text-text-primary border border-surface-border truncate">
                        {formattedArea}
                    </span>
                    <span className={`text-xxs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[status] || "bg-surface-hover text-text-faint border-surface-border"}`}>
                        {status}
                    </span>
                </div>

                {/* Project Title & Type */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xxs font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-surface-hover text-text-faint border border-surface-border">
                            {projectType?.replace("_", " ")}
                        </span>
                        <span className="text-xxs font-medium text-text-faint">
                            Timeline: {timeLine}
                        </span>
                    </div>
                    <h3 className="text-sm font-bold text-text-primary leading-snug line-clamp-1 group-hover:text-accent-hover transition-colors">
                        {projectTitle}
                    </h3>
                </div>

                {/* Budget Range */}
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <span className="font-semibold text-text-primary">Budget:</span>
                    <span>{formattedBudget}</span>
                </div>

                {/* Date */}
                <p className="text-xxs text-text-faint">{createdAt}</p>

                {/* Rejection Note */}
                {status === "Rejected" && rejectionReason && (
                    <div className="bg-error-tint border-l-2 border-error rounded px-3 py-2 mt-1">
                        <p className="text-xxs font-semibold uppercase tracking-wide text-error mb-0.5">Rejection reason</p>
                        <p className="text-xs text-error leading-relaxed">{rejectionReason}</p>
                    </div>
                )}

                {/* Footer Section */}
                <div className="mt-auto pt-3">
                    <div className="h-px bg-surface-border mb-3" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center shrink-0">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={userName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-4 h-4 text-text-faint" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-text-primary leading-tight truncate">{userName}</p>
                        </div>
                        <div className="ml-auto">
                            <ArrowUpRight size={16} className="text-text-faint group-hover:text-accent-hover transition-colors duration-200" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {status === "Pending" && (
                        <div
                            className="flex gap-2 mt-4"
                            onClick={(e) => e.stopPropagation()}
                        >
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