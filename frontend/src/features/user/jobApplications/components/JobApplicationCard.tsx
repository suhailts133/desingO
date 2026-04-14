import { ArrowUpRight, User } from "lucide-react"
import type { AllJobApplicationsDTO, JobApplicationStatus } from "../jobApplicationInterFace";

type Props = {
    application: AllJobApplicationsDTO
    onApprove: () => void
    onReject: () => void
    
}

const statusStyles: Record<JobApplicationStatus, string> = {
    Pending: "bg-yellow-50 text-yellow-900 border-yellow-200",
    Approved: "bg-green-50 text-green-900 border-green-200",
    Rejected: "bg-red-50 text-red-900 border-red-200",
    Ongoing: "bg-blue-50 text-blue-900 border-blue-200",
}


export default function JobApplicationCard({ application, onApprove, onReject }: Props) {
    const { status, rejectionReason,  jobTitle, designerName, propertyType, timeLine } = application

    const isActionable = status === "Pending"

    return (
        <div className="group bg-off-white w-full rounded-xl border border-blush-light/40 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
            <div className="px-4 pt-4 pb-4 flex flex-col gap-2 h-full">

                <div className="flex items-center justify-between">
                    <span className="text-xxs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-blush-pale text-blush-deep border border-blush-light/70">
                        {propertyType}
                    </span>
                    <span className={`text-xxs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border ${statusStyles[status]}`}>
                        {status}
                    </span>
                </div>

                <div>
                    <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-soft-black/10 text-soft-black/70 border border-soft-black/10">
                        {timeLine}
                    </span>
                </div>

                <h3 className="text-md font-semibold leading-snug text-soft-black group-hover:text-blush-deep transition-colors duration-200 truncate">
                    {jobTitle}
                </h3>

                {status === "Rejected" && rejectionReason && (
                    <div className="bg-red-50 border-l-2 border-red-400 rounded px-3 py-2">
                        <p className="text-xxs font-semibold uppercase tracking-wide text-red-800 mb-0.5">Rejection reason</p>
                        <p className="text-xs text-red-700 leading-relaxed">{rejectionReason}</p>
                    </div>
                )}

                <div className="mt-auto pt-2">
                    <div className="h-px bg-blush-light/40 mb-3" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                            <User className="w-7 h-7 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-[12px] font-semibold text-soft-black leading-tight">{designerName}</p>
                        </div>
                        <ArrowUpRight size={16} className="ml-auto text-soft-black/30 group-hover:text-blush-deep transition-colors duration-200" />
                    </div>

                    {
                        status === "Pending" && (
                            <div className="flex gap-2 mt-3">
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
                        )
                    }
                </div>

            </div>
        </div>
    )
}