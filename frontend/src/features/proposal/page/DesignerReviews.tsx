import { Star, User } from "lucide-react"
import type { ReviewsLIST } from "../proposalInterface"
import ReviewCard from "../component/ReviewCard"

interface Props {
  reviews: ReviewsLIST[]
  total: number
}

export default function DesignerReviews({ reviews, total }: Props) {
  if (!reviews.length) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold tracking-widest uppercase font-Jost text-soft-black/60">
          Reviews
        </h2>
        <p className="text-sm text-soft-black/40 font-Jost">No reviews yet.</p>
      </div>
    )
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-widest uppercase font-Jost text-soft-black/60">
          Reviews
          <span className="ml-2 text-soft-black/30 font-normal">({total})</span>
        </h2>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-blush-deep text-blush-deep" />
          <span className="text-sm font-Jost text-soft-black">
            {avgRating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Review Cards */}
      <div className="flex flex-col gap-4">
        {reviews.map((review, idx) => (
          <ReviewCard key={idx} review={review} />
        ))}
      </div>
    </div>
  )
}