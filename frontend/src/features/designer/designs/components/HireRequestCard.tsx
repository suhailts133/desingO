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
    Pending: "bg-yellow-50 text-yellow-900 border-yellow-200",
    Ongoing: "bg-blue-50 text-blue-900 border-blue-200",
    Accepted: "bg-green-50 text-green-900 border-green-200",
    Rejected: "bg-red-50 text-red-900 border-red-200",
    Closed: "bg-gray-100 text-gray-700 border-gray-200",
}

export default function HireRequestCard({ request, onApprove, onReject }: Props) {
    const { id, userName, profileImage, projectTitle, projectType, totalArea, rooms, areaUnit, minBudget, maxBudget, timeLine, createdAt, status, rejectionReason, } = request

    const isActionable = status === "Pending"
    const navigate = useNavigate()

    const formattedArea = `${totalArea} ${areaUnit}² · ${rooms} ${rooms === 1 ? "Room" : "Rooms"}`
    const formattedBudget = `$${minBudget?.toLocaleString()} - $${maxBudget?.toLocaleString()}`

    return (
        <div
            onClick={() => navigate(`/jobs/${id}`)}
            className="group bg-off-white w-full rounded-xl border border-blush-light/40 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
        >
            <div className="px-4 pt-4 pb-4 flex flex-col gap-2.5 h-full">

                {/* Header: Area/Rooms & Status */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xxs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-blush-pale text-blush-deep border border-blush-light/70">
                        {formattedArea}
                    </span>
                    <span className={`text-xxs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border ${statusStyles[status] || "bg-gray-50 text-gray-800 border-gray-200"}`}>
                        {status}
                    </span>
                </div>

                {/* Project Title & Type */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xxs font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-soft-black/10 text-soft-black/70 border border-soft-black/10">
                            {projectType?.replace("_", " ")}
                        </span>
                        <span className="text-xxs font-medium text-soft-black/60">
                            Timeline: {timeLine}
                        </span>
                    </div>
                    <h3 className="text-sm font-bold text-soft-black leading-snug line-clamp-1">
                        {projectTitle}
                    </h3>
                </div>

                {/* Budget Range */}
                <div className="flex items-center gap-1.5 text-xs text-soft-black/80">
                    <span className="font-semibold text-soft-black">Budget:</span>
                    <span>{formattedBudget}</span>
                </div>

                {/* Date */}
                <p className="text-xxs text-soft-black/60">{createdAt}</p>

                {/* Rejection Note */}
                {status === "Rejected" && rejectionReason && (
                    <div className="bg-red-50 border-l-2 border-red-400 rounded px-3 py-2">
                        <p className="text-xxs font-semibold uppercase tracking-wide text-red-800 mb-0.5">Rejection reason</p>
                        <p className="text-xs text-red-700 leading-relaxed">{rejectionReason}</p>
                    </div>
                )}

                {/* Footer Section */}
                <div className="mt-auto pt-2">
                    <div className="h-px bg-blush-light/40 mb-3" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-full bg-blush-pale border-2 border-blush-light/50 flex items-center justify-center shrink-0">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={userName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5 text-blush-deep" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-soft-black leading-tight truncate">{userName}</p>
                        </div>
                        <div className="ml-auto">
                            <ArrowUpRight size={16} className="text-soft-black/30 group-hover:text-blush-deep transition-colors duration-200" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {status === "Pending" && (
                        <div
                            className="flex gap-2 mt-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                disabled={!isActionable}
                                onClick={onApprove}
                                className="flex-1 text-xxs font-semibold tracking-widest uppercase py-1.5 rounded-lg border transition-colors duration-150 bg-success/30 text-green-900 border-green-200 hover:bg-success/80 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ✓ Approve
                            </button>
                            <button
                                disabled={!isActionable}
                                onClick={onReject}
                                className="flex-1 text-xxs font-semibold tracking-widest uppercase py-1.5 rounded-lg border transition-colors duration-150 bg-error/30 text-red-900 border-red-200 hover:bg-error/80 disabled:opacity-40 disabled:cursor-not-allowed"
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