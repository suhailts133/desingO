import { Heart, IndianRupee, User } from "lucide-react";

export type PreviewDesign = {
  img: string;
  name: string;
  spaceType: string;
  styles: string[];
  minPrice: number;
  maxPrice: number;
  designerName: string;
  rating: number; // whole stars filled, out of 5
  saved?: boolean;
};

const STAR = "5,1 6.18,3.41 9,3.76 7,5.73 7.45,8.5 5,7.22 2.55,8.5 3,5.73 1,3.76 3.82,3.41";

export default function PreviewDesignCard({ design: d }: { design: PreviewDesign }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-surface-border bg-surface shadow-lg">
      <div className="relative h-36 overflow-hidden bg-surface-hover">
        <img
          src={d.img}
          alt=""
          width={800}
          height={560}
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-3 left-3 rounded-full border border-surface-border bg-accent-tint px-2.5 py-1 text-xxs font-semibold uppercase tracking-widest text-accent-tint-text">
          {d.spaceType}
        </span>
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-surface-border bg-surface">
          <Heart size={14} className={d.saved ? "fill-accent text-accent" : "text-accent"} />
        </span>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4 pt-3.5">
        <div className="flex flex-wrap gap-1.5">
          {d.styles.map((s) => (
            <span
              key={s}
              className="rounded-full border border-surface-border bg-accent-tint px-2.5 py-0.75 text-xxs font-semibold uppercase tracking-wide text-accent-tint-text"
            >
              {s}
            </span>
          ))}
        </div>

        <h3 className="truncate text-md font-semibold leading-snug text-text-primary">{d.name}</h3>

        <div className="flex items-center gap-1 text-accent">
          <IndianRupee size={11} strokeWidth={2.5} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            {d.minPrice.toLocaleString("en-IN")} - {d.maxPrice.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="h-px bg-surface-border" />

        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface-border bg-surface-hover">
            <User className="h-4 w-4 text-text-faint" />
          </div>
          <div>
            <p className="text-[12px] font-semibold leading-tight text-text-primary">{d.designerName}</p>
            <div className="mt-0.5 flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  viewBox="0 0 10 10"
                  className="h-2.5 w-2.5"
                  strokeWidth="1"
                  fill={i <= d.rating ? "var(--color-accent)" : "none"}
                  stroke={i <= d.rating ? "var(--color-accent)" : "var(--color-text-faint)"}
                >
                  <polygon points={STAR} />
                </svg>
              ))}
              <span className="ml-0.5 text-xxs text-text-faint">({d.rating.toFixed(1)})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
