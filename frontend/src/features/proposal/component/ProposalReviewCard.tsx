import { Star } from "lucide-react"
import type { ProposalReviewDTO } from "../proposalInterface"

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })

type Props = {
    review: ProposalReviewDTO
}

export default function ProposalReviewCard({ review }: Props) {
    return (
        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint">Your review</h2>
                <span className="text-xs text-text-faint">{formatDate(review.createdAt)}</span>
            </div>
            <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? "fill-warning text-warning" : "fill-surface-border text-surface-border"}
                    />
                ))}
            </div>
            <p className="text-sm text-text-muted">{review.comment}</p>
        </div>
    )
}