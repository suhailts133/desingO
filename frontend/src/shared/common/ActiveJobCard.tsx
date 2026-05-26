import { User, FileText, Hash, Calendar } from "lucide-react"
import type { ActiveJobResponseDTO } from "../../features/designer/activeJobs/designerActiveJobsInterface"

const statusStyles: Record<ActiveJobResponseDTO["status"], string> = {
    Active: "bg-green-50 text-green-800 border border-green-200",
    Completed: "bg-blush-pale text-blush-deep border border-blush-light/60",
    Cancelled: "bg-red-50 text-red-700 border border-red-200",
}

const sourceStyles: Record<ActiveJobResponseDTO["sourceType"], string> = {
    jobRequest: "bg-blush-pale text-blush-deep border border-blush-light/60",
    direct_hire: "bg-purple-50 text-purple-700 border border-purple-200",
}

const sourceLabel: Record<ActiveJobResponseDTO["sourceType"], string> = {
    jobRequest: "Job request",
    direct_hire: "Direct hire",
}

const proposalStyles: Record<ActiveJobResponseDTO["proposalStatus"], string> = {
    NOT_CREATED: "bg-amber-50 text-amber-700 border border-amber-200",
    CREATED: "bg-blue-50 text-blue-700 border border-blue-200",
    REJECTED: "bg-red-50 text-red-700 border border-red-200",
}

const proposalLabel: Record<ActiveJobResponseDTO["proposalStatus"], string> = {
    NOT_CREATED: "Proposal pending",
    CREATED: "Proposal created",
    REJECTED: "Proposal rejected",
}

type Props = {
    data: ActiveJobResponseDTO
}

export default function ActiveJobCard({ data }: Props) {
    return (
        <div className="bg-off-white w-full rounded-xl border border-blush-light/40 shadow-lg hover:shadow-2xl transition-shadow duration-300 px-4 pt-4 pb-4 flex flex-col gap-0">

            {/* Header — avatar + name + status */}
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blush-pale border-2 border-blush-light/50 flex items-center justify-center shrink-0">
                    {data.profileImage ? (
                        <img
                            src={data.profileImage}
                            alt={data.userName}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <User className="w-5 h-5 text-blush-deep" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-soft-black truncate leading-tight">{data.userName}</p>
                </div>

                <span className={`text-xxs font-semibold px-2.5 py-1 rounded-full ${statusStyles[data.status]}`}>
                    {data.status}
                </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-blush-light/40 my-3" />

            {/* Source name + type badge */}
            <div className="flex items-center gap-2 text-xs text-soft-black/50">
                <FileText size={13} className="shrink-0 text-soft-black/30" />
                <span className="flex-1 truncate text-soft-black/70 font-medium">{data.sourceName}</span>
                <span className={`text-xxs font-semibold px-2.5 py-1 rounded-full ${sourceStyles[data.sourceType]}`}>
                    {sourceLabel[data.sourceType]}
                </span>
            </div>

            {/* Source ID */}
            <div className="flex items-center gap-2 text-xs text-soft-black/50 mt-2">
                <Hash size={13} className="shrink-0 text-soft-black/30" />
                <span className="font-mono text-[11px] text-soft-black/40 truncate">{data.sourceId}</span>
            </div>

            {/* Divider */}
            <div className="h-px bg-blush-light/40 my-3" />

            {/* Footer — started at + proposal status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-soft-black/40">
                    <Calendar size={12} className="shrink-0" />
                    <span className="text-xxs tracking-wide">Started {data.startedAt}</span>
                </div>
                <span className={`text-xxs font-semibold px-2.5 py-1 rounded-full ${proposalStyles[data.proposalStatus]}`}>
                    {proposalLabel[data.proposalStatus]}
                </span>
            </div>

        </div>
    )
}