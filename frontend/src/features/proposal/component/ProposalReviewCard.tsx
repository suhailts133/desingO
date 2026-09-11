// components/ProposalReviewCard.tsx
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
        <div className="bg-white rounded-2xl border border-blush-light/40 shadow-sm px-6 py-5">
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black/40">Your review</h2>
                <span className="text-xs text-soft-black/40">{formatDate(review.createdAt)}</span>
            </div>
            <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                    />
                ))}
            </div>
            <p className="text-sm text-soft-black/70">{review.comment}</p>
        </div>
    )
}