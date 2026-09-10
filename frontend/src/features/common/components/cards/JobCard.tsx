import { MapPin, BedDouble, IndianRupee, ArrowUpRight, User, Navigation } from "lucide-react"
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
            <div className="px-5 pt-5 pb-4 flex flex-col gap-3.5 h-full">

                {/* Metadata row — property type, rooms */}
                <div className="flex items-center justify-between text-soft-black/40">
                    <span className="text-xxs font-semibold tracking-widest uppercase">
                        {job.propertyType}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xxs font-semibold tracking-widest uppercase">
                        <BedDouble size={12} strokeWidth={2} />
                        {job.rooms} Rooms
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold leading-snug text-soft-black group-hover:text-blush-deep transition-colors duration-200 truncate">
                    {job.projectTitle}
                </h3>

                {/* Location — now the clear, high-contrast line */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-soft-black/75 min-w-0">
                        <MapPin size={13} strokeWidth={2.5} className="shrink-0 text-blush-deep" />
                        <span className="text-sm font-medium tracking-wide truncate">
                            {job.city}, {job.district}, {job.state}
                        </span>
                    </div>
                    {job.distanceInKm && (
                        <span className="inline-flex items-center gap-1 text-xxs font-semibold text-soft-black/50 shrink-0">
                            <Navigation size={11} strokeWidth={2.5} />
                            {job.distanceInKm} km
                        </span>
                    )}
                </div>

                {/* Tags — timeline + design styles, one row */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-blush-pale text-blush-deep border border-blush-light/70">
                        {job.timeLine}
                    </span>
                    {job.designStyles.length > 0 && (
                        <>
                            <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-soft-black/5 text-soft-black/60 border border-soft-black/10">
                                {job.designStyles[0]}
                            </span>
                            {job.designStyles.length > 1 && (
                                <span className="text-xxs font-semibold tracking-wide px-2 py-1 rounded-full bg-soft-black/5 text-soft-black/60 border border-soft-black/10">
                                    +{job.designStyles.length - 1}
                                </span>
                            )}
                        </>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm font-dm-sans-light text-soft-black/60 leading-relaxed line-clamp-2">
                    {job.description}
                </p>

                {/* Budget — standalone highlight */}
                <div className="flex items-center gap-1 text-blush-deep">
                    <IndianRupee size={13} strokeWidth={2.5} />
                    <span className="text-sm font-semibold tracking-wide">
                        {job.minBudget.toLocaleString("en-IN")} - {job.maxBudget.toLocaleString("en-IN")}
                    </span>
                </div>

                {/* Bottom row — always pinned to bottom */}
                <div className="mt-auto pt-3">
                    <div className="h-px bg-blush-light/40 mb-3" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center shrink-0">
                            <User className="w-7 h-7 text-gray-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-soft-black leading-tight truncate">{job.name}</p>
                            <p className="text-xxs text-soft-black/50 mt-0.5">{job.createdAt}</p>
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