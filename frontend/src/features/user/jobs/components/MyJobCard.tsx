import { Eye, Trash, Pencil, MapPin, Clock, Wallet, BedDouble, ScrollText } from "lucide-react"
import type { JobsResponseDTO, JobStatus } from "../jobInterface"
import { useNavigate } from "react-router-dom"


type Props = {
    jobRequest: JobsResponseDTO,
    onDeleteClick: () => void
}

export default function MyJobCard({ jobRequest, onDeleteClick }: Props) {
    const navigate = useNavigate()
    const statusStyle = (status: JobStatus) => {
        switch (status) {
            case "Pending":
                return "bg-warning-tint text-warning-text border-surface-border"
            case "Ongoing":
                return "bg-success-tint text-success-text border-surface-border"
            case "Closed":
                return "bg-surface-hover text-text-faint border-surface-border"
            case "Terminated":
                return "bg-surface-hover text-text-faint border border-surface-border"
            case "Rejected":
                return "bg-error-tint text-error-text border border-error"
        }
    }
    const getJobDetail = (id: string) => {
        navigate(`/jobs/${id}`)
    }
    const updateJobRequestPage = (id: string) => {
        navigate(`/customer/jobs/edit/${id}`)
    }
    const jobApplications = (id: string) => {
        navigate(`/customer/job-applications/${id}`)
    }
    return (
        <div className="group bg-surface w-full h-full rounded-xl border border-surface-border hover:border-accent overflow-hidden transition-colors duration-300 flex flex-col">

            {/* Header strip */}
            <div className="relative h-16 bg-surface-hover px-5 flex items-center justify-between">
                <span className="text-xs font-medium tracking-widest uppercase text-text-faint">
                    {jobRequest.propertyType}
                </span>
                <span className={`text-xxs font-medium px-2.5 py-1 rounded-full border ${statusStyle(jobRequest.status)}`}>
                    {jobRequest.status}
                </span>
            </div>

            <div className="px-5 pt-4 pb-5 flex-1 flex flex-col">

                {/* Title */}
                <div className="flex items-start justify-between gap-3 mt-1 mb-1">
                    <h5 className="font-Jost-Semibold text-lg font-semibold text-text-primary leading-snug hover:text-accent-hover transition-colors duration-200 cursor-pointer"
                        onClick={() => getJobDetail(jobRequest.id)}
                    >
                        {jobRequest.projectTitle}
                    </h5>

                    {
                        jobRequest.sourceType === "JOB_REQUEST" && (
                            <button
                                onClick={() => jobApplications(jobRequest.id)}
                                title="Job Applications"
                                className="shrink-0 inline-flex items-center gap-1.5 bg-accent text-text-on-accent hover:bg-accent-hover px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-200"
                            >
                                <ScrollText className="w-3.5 h-3.5" />
                                <span>Job Applications</span>
                            </button>
                        )
                    }
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3 text-accent" />
                    <span className="text-xs text-text-faint">
                        {jobRequest.state},
                        {jobRequest.district},
                        {jobRequest.city}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm font-dm-sans-light text-text-muted leading-relaxed line-clamp-2 mb-4">
                    {jobRequest.description}
                </p>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-[11px] bg-accent-tint text-accent-tint-text px-2.5 py-1 rounded-full border border-surface-border">
                        <Clock className="w-3 h-3" /> {jobRequest.timeLine}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] bg-accent-tint text-accent-tint-text px-2.5 py-1 rounded-full border border-surface-border">
                        <Wallet className="w-3 h-3" /> {jobRequest.minBudget.toLocaleString("en-IN")} - {jobRequest.maxBudget.toLocaleString("en-IN")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px]  bg-accent-tint text-accent-tint-text px-2.5 py-1 rounded-full border border-surface-border">
                        <BedDouble className="w-3 h-3" /> {jobRequest.rooms} Rooms
                    </span>
                </div>

                {/* Divider + Actions — pinned to bottom regardless of content length above */}
                <div className="mt-auto pt-4">
                    <div className="h-px bg-surface-border mb-4" />

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => getJobDetail(jobRequest.id)}
                            title="View"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 text-text-muted bg-surface hover:bg-surface-hover hover:text-accent-hover border border-surface-border hover:border-surface-border-strong rounded-lg text-xs font-medium py-2 transition-all duration-200"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                        </button>

                        <button
                            onClick={() => updateJobRequestPage(jobRequest.id)}
                            title="Edit"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 text-text-muted bg-surface hover:bg-surface-hover hover:text-accent-hover border border-surface-border hover:border-surface-border-strong rounded-lg text-xs font-medium py-2 transition-all duration-200"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                        </button>

                        <button
                            onClick={onDeleteClick}
                            title="Delete"
                            className="inline-flex items-center justify-center text-text-faint hover:text-error bg-surface hover:bg-error-tint border border-surface-border hover:border-error rounded-lg p-2 transition-all duration-200"
                        >
                            <Trash className="w-3.5 h-3.5 text-error" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}