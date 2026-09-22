import { Star } from "lucide-react"
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
        <h2 className="text-sm font-semibold tracking-widest uppercase font-Jost text-text-faint">
          Reviews
        </h2>
        <p className="text-sm text-text-muted font-Jost">No reviews yet.</p>
      </div>
    )
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-widest uppercase font-Jost text-text-faint">
          Reviews
          <span className="ml-2 text-text-muted font-normal">({total})</span>
        </h2>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="text-sm font-Jost text-text-primary">
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