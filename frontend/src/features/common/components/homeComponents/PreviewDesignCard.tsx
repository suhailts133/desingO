import { Heart, IndianRupee } from "lucide-react";

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
      </div>
    </div>
  );
}
