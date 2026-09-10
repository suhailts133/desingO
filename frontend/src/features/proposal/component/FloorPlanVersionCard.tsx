import type { floorPlanDTO } from "../proposalInterface"
import { dateFormater } from "../../../helpers/dateFormater"
import { FileText, ExternalLink } from "lucide-react"

const statusStyle: Record<floorPlanDTO["status"], string> = {
    "Pending": "bg-amber-50 text-amber-700 border-amber-200",
    "Approved": "bg-green-50 text-green-700 border-green-200",
    "Rejected": "bg-red-50 text-red-700 border-red-200",
}

interface FloorPlanVersionCardProps {
    plan: floorPlanDTO
    isLatest: boolean
}

export default function FloorPlanVersionCard({ plan, isLatest }: FloorPlanVersionCardProps) {
    return (
        <div className={`rounded-lg border p-3 ${isLatest ? "border-blush-light/50 bg-off-white/40" : "border-gray-100"}`}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-Jost-Semibold text-soft-black">
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
                    className="flex items-center gap-2 text-xs text-gray-700 hover:text-soft-black truncate"
                >
                    <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="truncate">Floor Plan v{plan.version}.pdf</span>
                    <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                </a>
                <span className="text-[11px] text-soft-black/40 shrink-0">
                    {dateFormater(plan.createdAt)}
                </span>
            </div>

            {plan.status === "Rejected" && plan.rejectionReason && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-2.5 py-1.5">
                    {plan.rejectionReason}
                </div>
            )}
        </div>
    )
}