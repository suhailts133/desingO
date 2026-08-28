import { MapPin, BedDouble, IndianRupee, ArrowUpRight, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { JobsCommonResponseDTO } from "../../../user/jobs/jobInterface"

type Props = {
    job: JobsCommonResponseDTO
}

export default function JobCard({ job }: Props) {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="group bg-off-white w-full rounded-xl border border-blush-light/40 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
        >
            <div className="px-4 pt-4 pb-4 flex flex-col gap-2 h-full">

                {/* Top content */}
                <div className="flex flex-col gap-2">

                    {/* Property type + rooms */}
                    <div className="flex items-center justify-between">
                        <span className="text-xxs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-blush-pale text-blush-deep border border-blush-light/70">
                            {job.propertyType}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xxs font-semibold tracking-widest uppercase text-soft-black/50">
                            <BedDouble size={12} strokeWidth={2} />
                            {job.rooms} Rooms
                        </span>
                    </div>

                    {/* Timeline pill */}
                    <div>
                        <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-blush-pale text-blush-deep border border-blush-light/70">
                            {job.timeLine}
                        </span>
                    </div>

                    {/* Design styles */}
                    <div className="flex flex-wrap gap-1.5">
                        {job.designStyles.map(d => (
                            <span key={d} className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-soft-black/10 text-soft-black/70 border border-soft-black/10">
                                {d}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-md font-semibold leading-snug text-soft-black group-hover:text-blush-deep transition-colors duration-200 truncate">
                        {job.projectTitle}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-soft-black/50">
                        <MapPin size={11} strokeWidth={2.5} />
                        <span className="text-xs tracking-wide">{job.city}, {job.district}, {job.state}</span>
                    </div>

                    {/* Budget */}
                    <div className="flex items-center gap-1 text-blush-deep/75">
                        <IndianRupee size={11} strokeWidth={2.5} />
                        <span className="text-xs font-semibold tracking-widest uppercase">
                            Budget  {job.minBudget.toLocaleString("en-IN")} - {job.maxBudget.toLocaleString("en-IN")}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm font-dm-sans-light text-soft-black/70 leading-relaxed line-clamp-2">
                        {job.description}
                    </p>

                </div>

                {/* Bottom row — always pinned to bottom */}
                <div className="mt-auto pt-2">
                    <div className="h-px bg-blush-light/40 mb-3" />
                    <div className="flex items-center gap-2.5">
                           <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                <User className="w-7 h-7 text-gray-400" />
                            </div>
                        <div>
                            <p className="text-[12px] font-semibold text-soft-black leading-tight">{job.name}</p>
                            <p className="text-xxs text-soft-black/40 mt-0.5">{job.createdAt}</p>
                        </div>
                        <ArrowUpRight
                            size={16}
                            className="ml-auto text-soft-black/30 group-hover:text-blush-deep transition-colors duration-200"
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}