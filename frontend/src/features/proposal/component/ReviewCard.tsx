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
    <div className="flex gap-3 p-4 rounded-xl border border-surface-border bg-surface">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center overflow-hidden shrink-0">
        {profileImage ? (
          <img
            src={profileImage}
            alt={userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-5 h-5 text-text-faint" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold font-Jost text-text-primary">
            {userName}
          </span>
          <span className="text-xs text-text-faint font-Jost">{formatted}</span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < rating
                  ? "fill-accent text-accent"
                  : "fill-surface-border text-surface-border"
                }`}
            />
          ))}
        </div>

        <p className="text-sm text-text-muted font-Jost leading-relaxed mt-0.5">
          {comment}
        </p>
      </div>
    </div>
  )
}