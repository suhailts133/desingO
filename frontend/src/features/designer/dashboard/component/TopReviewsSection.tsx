import { Star, User } from "lucide-react"
import type { ReviewsLIST } from "../../../proposal/proposalInterface"

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })

const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={13}
                className={i < rating ? "fill-accent text-accent" : "fill-surface-border text-surface-border"}
            />
        ))}
    </div>
)
type Props = {
    reviews: ReviewsLIST[]
}

export default function TopReviewsSection({ reviews }: Props) {
    return (
        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <Star size={20} className="text-accent" />
                <p className="text-base font-semibold text-text-primary">Top reviews</p>
            </div>

            {reviews.length === 0 ? (
                <p className="text-sm text-text-faint">No reviews yet.</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {reviews.map((review, i) => (
                        <li
                            key={`${review.userName}-${review.createdAt}-${i}`}
                            className="flex gap-3 border-b border-surface-border last:border-b-0 pb-4 last:pb-0"
                        >
                            {review.profileImage ? (
                                <img
                                    src={review.profileImage}
                                    alt={review.userName}
                                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-surface-border"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center shrink-0">
                                    <User size={16} className="text-text-faint" />
                                </div>
                            )}

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-medium text-text-primary truncate">{review.userName}</p>
                                    <span className="text-xs text-text-faint shrink-0">{formatDate(review.createdAt)}</span>
                                </div>
                                <RatingStars rating={review.rating} />
                                <p className="text-xs text-text-muted mt-1 line-clamp-2">{review.comment}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}