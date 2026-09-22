import { User, FileText, Calendar } from "lucide-react"
import type { ActiveJobResponseDTO } from "../../features/designer/activeJobs/designerActiveJobsInterface"
import { useNavigate } from "react-router-dom"
import { useDecodeAccessToken } from "../../helpers/decodeAccessToken"

const statusStyles: Record<ActiveJobResponseDTO["status"], string> = {
    Active: "bg-success-tint text-success-text border border-success",
    Completed: "bg-accent-tint text-accent-tint-text border border-surface-border",
    Cancelled: "bg-error-tint text-error-text border border-error",
    Terminated: "bg-surface-hover text-text-faint border border-surface-border",
}

const sourceStyles: Record<ActiveJobResponseDTO["sourceType"], string> = {
    jobRequest: "bg-accent-tint text-accent-tint-text border border-surface-border",
    direct_hire: "bg-warning-tint text-warning-text border border-warning",
}

const sourceLabel: Record<ActiveJobResponseDTO["sourceType"], string> = {
    jobRequest: "Job request",
    direct_hire: "Direct hire",
}

const proposalStyles: Record<ActiveJobResponseDTO["proposalStatus"], string> = {
    NOT_CREATED: "bg-warning-tint text-warning-text border border-warning",
    CREATED: "bg-accent-tint text-accent-tint-text border border-surface-border",
    REJECTED: "bg-error-tint text-error-text border border-error",
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

    const navigate = useNavigate();
    const { role } = useDecodeAccessToken()
    const viewProposal = (id: string) => {
        const basePath = role === "Designer" ? "/designer/proposal" : "/customer/proposal";

        navigate(`${basePath}/${id}`, {
            state: {
                activeJobId: data.id,
                sourceType: data.sourceType,
                sourceId: data.sourceId,
            },
        });
    };
    return (
        <div onClick={() => viewProposal(data.sourceId)} className="bg-surface w-full rounded-xl border border-surface-border hover:border-accent transition-colors duration-300 px-4 pt-4 pb-4 flex flex-col gap-0">

            {/* Header — avatar + name + status */}
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center shrink-0">
                    {data.profileImage ? (
                        <img
                            src={data.profileImage}
                            alt={data.userName}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <User className="w-5 h-5 text-text-faint" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate leading-tight">{data.userName}</p>
                </div>

                <span className={`text-xxs font-semibold px-2.5 py-1 rounded-full ${statusStyles[data.status]}`}>
                    {data.status}
                </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-surface-border my-3" />

            {/* Source name + type badge */}
            <div className="flex items-center gap-2 text-xs text-text-faint">
                <FileText size={13} className="shrink-0 text-text-faint" />
                <span className="flex-1 truncate text-text-muted font-medium">{data.sourceName}</span>
                <span className={`text-xxs font-semibold px-2.5 py-1 rounded-full ${sourceStyles[data.sourceType]}`}>
                    {sourceLabel[data.sourceType]}
                </span>
            </div>

      

            {/* Divider */}
            <div className="h-px bg-surface-border my-3" />

            {/* Footer — started at + proposal status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-text-faint">
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