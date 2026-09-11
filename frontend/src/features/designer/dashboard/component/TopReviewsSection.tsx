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
                className={i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
            />
        ))}
    </div>
)

type Props = {
    reviews: ReviewsLIST[]
}

export default function TopReviewsSection({ reviews }: Props) {
    return (
        <div className="bg-off-white rounded-2xl border border-blush-light/40 shadow-lg px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <Star size={20} className="text-blush-deep" />
                <p className="text-base font-semibold text-soft-black">Top reviews</p>
            </div>

            {reviews.length === 0 ? (
                <p className="text-sm text-soft-black/40">No reviews yet.</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {reviews.map((review, i) => (
                        <li
                            key={`${review.userName}-${review.createdAt}-${i}`}
                            className="flex gap-3 border-b border-blush-light/30 last:border-b-0 pb-4 last:pb-0"
                        >
                            {review.profileImage ? (
                                <img
                                    src={review.profileImage}
                                    alt={review.userName}
                                    className="w-9 h-9 rounded-full object-cover shrink-0"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-blush-light/40 flex items-center justify-center shrink-0">
                                    <User size={16} className="text-blush-deep" />
                                </div>
                            )}

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-medium text-soft-black truncate">{review.userName}</p>
                                    <span className="text-xs text-soft-black/40 shrink-0">{formatDate(review.createdAt)}</span>
                                </div>
                                <RatingStars rating={review.rating} />
                                <p className="text-xs text-soft-black/60 mt-1 line-clamp-2">{review.comment}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}