import { Star, User } from "lucide-react"
import type { ReviewsLIST } from "../proposalInterface"

export default function ReviewCard({ review }: { review: ReviewsLIST }) {
  const { comment, rating, userName, profileImage, createdAt } = review

  const formatted = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="flex gap-3 p-4 rounded-xl border border-soft-black/10 bg-white">
      {/* Avatar */}
      <div className="w-9 h-9 min-w-9 rounded-full bg-blush-deep/10 flex items-center justify-center overflow-hidden">
        {profileImage ? (
          <img
            src={profileImage}
            alt={userName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User className="w-5 h-5 text-blush-deep" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold font-Jost text-soft-black">
            {userName}
          </span>
          <span className="text-xs text-soft-black/40 font-Jost">{formatted}</span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < rating
                  ? "fill-blush-deep text-blush-deep"
                  : "fill-soft-black/10 text-soft-black/10"
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-soft-black/70 font-Jost leading-relaxed">
          {comment}
        </p>
      </div>
    </div>
  )
}