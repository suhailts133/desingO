import type { floorPlanDTO } from "../proposalInterface"
import { dateFormater } from "../../../helpers/dateFormater"
import { FileText, ExternalLink } from "lucide-react"

const statusStyle: Record<floorPlanDTO["status"], string> = {
    "Pending": "bg-warning-tint text-warning-text border-warning",
    "Approved": "bg-success-tint text-success-text border-success",
    "Rejected": "bg-error-tint text-error-text border-error",
}

interface FloorPlanVersionCardProps {
    plan: floorPlanDTO
    isLatest: boolean
}

export default function FloorPlanVersionCard({ plan, isLatest }: FloorPlanVersionCardProps) {
    return (
        <div className={`rounded-lg border p-3 ${isLatest ? "border-accent bg-surface-hover" : "border-surface-border"}`}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-Jost-Semibold text-text-primary">
                    Version {plan.version}
                </span>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusStyle[plan.status]}`}>
                    {plan.status}
                </span>
            </div>

            <div className="flex items-center justify-between gap-2">

                <a href={plan.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-text-muted hover:text-text-primary truncate"
                >
                    <FileText className="w-3.5 h-3.5 text-text-faint shrink-0" />
                    <span className="truncate">Floor Plan v{plan.version}.pdf</span>
                    <ExternalLink className="w-3 h-3 text-text-faint shrink-0" />
                </a>
                <span className="text-[11px] text-text-faint shrink-0">
                    {dateFormater(plan.createdAt)}
                </span>
            </div>

            {plan.status === "Rejected" && plan.rejectionReason && (
                <div className="mt-2 text-xs text-error-text bg-error-tint border border-error rounded-md px-2.5 py-1.5">
                    {plan.rejectionReason}
                </div>
            )}
        </div>
    )
}