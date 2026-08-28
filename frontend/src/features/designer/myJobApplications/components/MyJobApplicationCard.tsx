import { Trash2, ArrowUpRight } from "lucide-react"
import type { MyJobApplicationsDTO, JobApplicationStatus } from "../myJobApplicationInterFace"
import { useNavigate } from "react-router-dom"

type Props = {
    application: MyJobApplicationsDTO
    onDelete: () => void
}

const statusStyles: Record<JobApplicationStatus, string> = {
    Pending: "bg-yellow-50 text-yellow-900 border-yellow-200",
    Approved: "bg-green-50 text-green-900 border-green-200",
    Rejected: "bg-red-50 text-red-900 border-red-200",
    Ongoing: "bg-blue-50 text-blue-900 border-blue-200",
}

export default function MyJobApplicationCard({ application, onDelete }: Props) {
    const { status, rejectionReason, jobId, jobTitle, propertyType, timeLine, numberOfRooms, description, createdOn } = application
    const navigate = useNavigate();
    const getjobDetail = (id: string) => {
        navigate(`/jobs/${id}`)
    }
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

                <div className="flex items-center gap-2">
                    <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-soft-black/10 text-soft-black/70 border border-soft-black/10">
                        {timeLine}
                    </span>
                    <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-soft-black/10 text-soft-black/70 border border-soft-black/10">
                        {numberOfRooms} Rooms
                    </span>
                </div>

                <h3 className="text-md font-semibold leading-snug text-soft-black group-hover:text-blush-deep transition-colors duration-200 truncate">
                    {jobTitle}
                </h3>

                <p className="text-sm font-dm-sans-light text-soft-black/70 leading-relaxed line-clamp-2 mb-4">
                    {description}
                </p>

                {status === "Rejected" && rejectionReason && (
                    <div className="bg-red-50 border-l-2 border-red-400 rounded px-3 py-2">
                        <p className="text-xxs font-semibold uppercase tracking-wide text-red-800 mb-0.5">Rejection reason</p>
                        <p className="text-xs text-red-700 leading-relaxed">{rejectionReason}</p>
                    </div>
                )}

                <div className="mt-auto pt-2">
                    <div className="h-px bg-blush-light/40 mb-3" />
                    <div className="flex items-center gap-2.5">
                        <p className="text-xxs text-soft-black/70">Posted on: {createdOn}</p>
                        <div className="ml-auto flex items-center gap-2">
                            {status === "Pending" && (
                                <button
                                    onClick={onDelete}
                                    className="p-1.5 rounded-lg text-soft-black/30 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-150"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                            <button
                                onClick={() => getjobDetail(jobId)}
                                title="View"
                            >
                                <ArrowUpRight size={16} className="text-soft-black/30 group-hover:text-blush-deep transition-colors duration-200" />

                            </button>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}