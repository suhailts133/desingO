import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DesignCardSkeleton() {
  return (
    <SkeletonTheme baseColor="#1F1F24" highlightColor="#27272E">
      <div className="w-full rounded-xl bg-surface border border-surface-border overflow-hidden shadow-lg">
        {/* Image placeholder */}
        <div className="h-52">
          <Skeleton height="100%" />
        </div>

        <div className="px-4 pt-3.5 pb-4 flex flex-col gap-2">
          {/* Style tags */}
          <div className="flex gap-1.5">
            <Skeleton height={20} width={60} borderRadius={999} />
            <Skeleton height={20} width={60} borderRadius={999} />
          </div>

          {/* Title */}
          <Skeleton height={20} width="70%" />

          {/* Price */}
          <Skeleton height={14} width="50%" />

          {/* Divider */}
          <div className="h-px bg-surface-border" />

          {/* Designer */}
          <div className="flex items-center gap-2.5">
            <Skeleton circle height={28} width={28} />
            <div className="flex flex-col gap-1">
              <Skeleton height={12} width={100} />
              <Skeleton height={10} width={80} />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
