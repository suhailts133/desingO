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
                return "bg-yellow-100 text-yellow-700 border-yellow-200"
            case "Ongoing":
                return "bg-green-100 text-green-700 border-green-200"
            case "Closed":
                return "bg-gray-100 text-gray-500 border-gray-200"
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
        <div className="group bg-off-white w-full rounded-xl border border-blush-light/40 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">

            {/* Header strip */}
            <div className="relative h-16 bg-blush-pale px-5 flex items-center justify-between">
                <span className="text-xs font-medium tracking-widest uppercase text-blush-deep/70">
                    {jobRequest.propertyType}
                </span>
                <span className={`text-xxs font-medium px-2.5 py-1 rounded-full border ${statusStyle(jobRequest.status)}`}>
                    {jobRequest.status}
                </span>
            </div>

            <div className="px-5 pt-4 pb-5">

                {/* Title */}
                <div className="flex items-start justify-between gap-3 mt-1 mb-1">
                    <h5 className="font-Jost-Semibold text-lg font-semibold text-soft-black leading-snug hover:text-blush-deep transition-colors duration-200 cursor-pointer"
                        onClick={() => getJobDetail(jobRequest.id)}
                    >
                        {jobRequest.projectTitle}
                    </h5>

                    {
                        jobRequest.sourceType === "JOB_REQUEST" && (
                            <button
                                onClick={() => jobApplications(jobRequest.id)}
                                title="Job Applications"
                                className="shrink-0 inline-flex items-center gap-1.5 bg-soft-black text-off-white hover:bg-blush-deep px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <ScrollText className="w-3.5 h-3.5" />
                                <span>Job Applications</span>
                            </button>
                        )
                    }
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3 text-blush-deep/60" />
                    <span className="text-xs text-soft-black/50">
                        {jobRequest.state},
                        {jobRequest.district},
                        {jobRequest.city}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm font-dm-sans-light text-soft-black/70 leading-relaxed line-clamp-2 mb-4">
                    {jobRequest.description}
                </p>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-[11px] bg-snow-white text-blush-deep px-2.5 py-1 rounded-full border border-blush-light/50">
                        <Clock className="w-3 h-3" /> {jobRequest.timeLine}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] bg-snow-white text-blush-deep px-2.5 py-1 rounded-full border border-blush-light/50">
                        <Wallet className="w-3 h-3" /> {jobRequest.minBudget.toLocaleString("en-IN")} - {jobRequest.maxBudget.toLocaleString("en-IN")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px]  bg-snow-white text-blush-deep px-2.5 py-1 rounded-full border border-blush-light/50">
                        <BedDouble className="w-3 h-3" /> {jobRequest.rooms} Rooms
                    </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-soft-black/20 mb-4" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => getJobDetail(jobRequest.id)}
                        title="View"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-soft-black/70 bg-off-white hover:bg-blush-pale hover:text-blush-deep border border-blush-light/50 hover:border-blush-light rounded-lg text-xs font-medium py-2 transition-all duration-200"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                    </button>

                    <button
                        onClick={() => updateJobRequestPage(jobRequest.id)}
                        title="Edit"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-soft-black/70 bg-off-white hover:bg-blush-pale hover:text-blush-deep border border-blush-light/50 hover:border-blush-light rounded-lg text-xs font-medium py-2 transition-all duration-200"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                    </button>

                    <button
                        onClick={onDeleteClick}
                        title="Delete"
                        className="inline-flex items-center justify-center text-soft-black/50 hover:text-error bg-off-white hover:bg-red-50 border border-blush-light/50 hover:border-red-200 rounded-lg p-2 transition-all duration-200"
                    >
                        <Trash className="w-3.5 h-3.5 text-error" />
                    </button>
                </div>

            </div>
        </div>
    )
}