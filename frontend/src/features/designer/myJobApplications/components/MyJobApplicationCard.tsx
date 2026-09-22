import { Trash2, ArrowUpRight } from "lucide-react"
import type { MyJobApplicationsDTO, JobApplicationStatus } from "../myJobApplicationInterFace"
import { useNavigate } from "react-router-dom"

type Props = {
    application: MyJobApplicationsDTO
    onDelete: () => void
}

const statusStyles: Record<JobApplicationStatus, string> = {
    Pending: "bg-warning-tint text-warning-text border-warning-tint",
    Approved: "bg-success-tint text-success-text border-success-tint",
    Rejected: "bg-error-tint text-error border-error-tint",
    Ongoing: "bg-accent-tint text-accent-tint-text border-accent-tint",
}

export default function MyJobApplicationCard({ application, onDelete }: Props) {
    const { status, rejectionReason, jobId, jobTitle, propertyType, timeLine, numberOfRooms, description, createdOn } = application
    const navigate = useNavigate();
    
    const getjobDetail = (id: string) => {
        navigate(`/jobs/${id}`)
    }
    
    return (
        <div 
            onClick={() => getjobDetail(jobId)}
            className="group bg-surface w-full rounded-xl border border-surface-border overflow-hidden hover:border-accent transition-colors duration-300 cursor-pointer"
        >
            <div className="px-4 pt-4 pb-4 flex flex-col gap-2 h-full">

                <div className="flex items-center justify-between gap-2">
                    <span className="text-xxs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-surface-hover text-text-primary border border-surface-border truncate">
                        {propertyType}
                    </span>
                    <span className={`text-xxs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[status]}`}>
                        {status}
                    </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-surface-hover text-text-faint border border-surface-border">
                        {timeLine}
                    </span>
                    <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-surface-hover text-text-faint border border-surface-border">
                        {numberOfRooms} Rooms
                    </span>
                </div>

                <h3 className="text-md font-semibold leading-snug text-text-primary group-hover:text-accent-hover transition-colors duration-200 truncate mt-1">
                    {jobTitle}
                </h3>

                <p className="text-sm font-dm-sans-light text-text-muted leading-relaxed line-clamp-2 mb-4">
                    {description}
                </p>

                {status === "Rejected" && rejectionReason && (
                    <div className="bg-error-tint border-l-2 border-error rounded px-3 py-2">
                        <p className="text-xxs font-semibold uppercase tracking-wide text-error mb-0.5">Rejection reason</p>
                        <p className="text-xs text-error leading-relaxed">{rejectionReason}</p>
                    </div>
                )}

                <div className="mt-auto pt-2">
                    <div className="h-px bg-surface-border mb-3" />
                    <div className="flex items-center gap-2.5">
                        <p className="text-xxs text-text-faint">Posted on: {createdOn}</p>
                        
                        <div className="ml-auto flex items-center gap-2">
                            {status === "Pending" && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                    title="Delete application"
                                    className="p-1.5 rounded-lg text-text-faint hover:text-error hover:bg-error-tint border border-transparent hover:border-error transition-all duration-150"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                            <button
                                title="View"
                                className="p-1"
                            >
                                <ArrowUpRight size={16} className="text-text-faint group-hover:text-accent-hover transition-colors duration-200" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}