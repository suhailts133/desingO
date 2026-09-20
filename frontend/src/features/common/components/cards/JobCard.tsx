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
            className="group bg-surface w-full rounded-xl border border-surface-border hover:border-accent overflow-hidden transition-colors duration-300 cursor-pointer"
        >
            <div className="px-5 pt-5 pb-4 flex flex-col gap-3.5 h-full">

                {/* Metadata row — property type, rooms */}
                <div className="flex items-center justify-between text-text-faint">
                    <span className="text-xxs font-semibold tracking-widest uppercase">
                        {job.propertyType}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xxs font-semibold tracking-widest uppercase">
                        <BedDouble size={12} strokeWidth={2} />
                        {job.rooms} Rooms
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold leading-snug text-text-primary group-hover:text-accent-hover transition-colors duration-200 truncate">
                    {job.projectTitle}
                </h3>

                {/* Location — now the clear, high-contrast line */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-text-muted min-w-0">
                        <MapPin size={13} strokeWidth={2.5} className="shrink-0 text-accent" />
                        <span className="text-sm font-medium tracking-wide truncate">
                            {job.city}, {job.district}, {job.state}
                        </span>
                    </div>
                    {job.distanceInKm && typeof job.distanceInKm === "number" && job.distanceInKm > 0 && (
                        <span className="inline-flex items-center gap-1 text-xxs font-semibold text-text-faint shrink-0">
                            <Navigation size={11} strokeWidth={2.5} className="text-accent" />
                            {job.distanceInKm} km
                        </span>
                    )}
                </div>

                {/* Tags — timeline + design styles, one row */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-accent-tint text-accent-tint-text border border-surface-border">
                        {job.timeLine}
                    </span>
                    {job.designStyles.length > 0 && (
                        <>
                            <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-surface-hover text-text-muted border border-surface-border">
                                {job.designStyles[0]}
                            </span>
                            {job.designStyles.length > 1 && (
                                <span className="text-xxs font-semibold tracking-wide px-2 py-1 rounded-full bg-surface-hover text-text-muted border border-surface-border">
                                    +{job.designStyles.length - 1}
                                </span>
                            )}
                        </>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm font-dm-sans-light text-text-muted leading-relaxed line-clamp-2">
                    {job.description}
                </p>

                {/* Budget — standalone highlight */}
                <div className="flex items-center gap-1 text-accent">
                    <IndianRupee size={13} strokeWidth={2.5} />
                    <span className="text-sm font-semibold tracking-wide">
                        {job.minBudget.toLocaleString("en-IN")} - {job.maxBudget.toLocaleString("en-IN")}
                    </span>
                </div>

                {/* Bottom row — always pinned to bottom */}
                <div className="mt-auto pt-3">
                    <div className="h-px bg-surface-border mb-3" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center shrink-0">
                            <User className="w-7 h-7 text-text-faint" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-text-primary leading-tight truncate">{job.name}</p>
                            <p className="text-xxs text-text-faint mt-0.5">{job.createdAt}</p>
                        </div>
                        <ArrowUpRight
                            size={16}
                            className="ml-auto text-text-faint group-hover:text-accent-hover transition-colors duration-200"
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}