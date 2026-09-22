import { useState } from "react"
import FloorPlanVersionCard from "./FloorPlanVersionCard"
import type { floorPlanDTO } from "../proposalInterface"

type Role = "Designer" | "Admin" | "Customer"

interface FloorPlanSectionProps {
    floorPlans: floorPlanDTO[]
    role: Role
    isUploading?: boolean
    onUpload: () => void
    onApprove: (floorPlanId: string) => void
    onReject: (floorPlanId: string) => void
}

export default function FloorPlanSection({ floorPlans, role, isUploading, onUpload, onApprove, onReject, }: FloorPlanSectionProps) {
    const [historyOpen, setHistoryOpen] = useState(false)

    if (!floorPlans || floorPlans.length === 0) {
        return role === "Designer" ? (
            <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
                <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-primary mb-3">Floor Plans</h2>
                <button onClick={onUpload} disabled={isUploading} className="soft-black-button">
                    {isUploading ? "Uploading..." : "Upload Floor Plan"}
                </button>
            </div>
        ) : null
    }

    const sorted = [...floorPlans].sort((a, b) => b.version - a.version)
    const latest = sorted[0]
    const history = sorted.slice(1)

    const canUpload = role === "Designer" && latest.status === "Rejected"
    const canReview = role === "Customer" && latest.status === "Pending"

    return (
        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-primary mb-3">Floor Plans</h2>

            <FloorPlanVersionCard plan={latest} isLatest />

            {canReview && (
                <div className="flex items-center gap-2 mt-3">
                    <button
                        onClick={() => onApprove(latest.id)}
                        className="inline-flex items-center justify-center gap-1.5 bg-success-tint text-success-text border border-success hover:brightness-110 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => onReject(latest.id)}
                        className="inline-flex items-center justify-center gap-1.5 bg-error-tint text-error-text border border-error hover:brightness-110 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                    >
                        Reject
                    </button>
                </div>
            )}

            {canUpload && (
                <div className="mt-3">
                    <button onClick={onUpload} disabled={isUploading} className="soft-black-button">
                        {isUploading ? "Uploading..." : "Upload New Floor Plan"}
                    </button>
                </div>
            )}

            {history.length > 0 && (
                <div className="mt-3 pt-3 border-t border-surface-border">
                    <button
                        onClick={() => setHistoryOpen(prev => !prev)}
                        className="flex items-center gap-1.5 text-xs text-text-faint hover:text-text-primary transition-colors mb-2"
                    >
                        <span>{history.length} earlier version{history.length > 1 ? "s" : ""}</span>
                        <svg
                            className={`w-3 h-3 transition-transform duration-200 ${historyOpen ? "rotate-180" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {historyOpen && (
                        <div className="flex flex-col gap-2">
                            {history.map(p => (
                                <FloorPlanVersionCard key={p.id} plan={p} isLatest={false} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}