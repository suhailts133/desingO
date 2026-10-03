import PreviewDesignCard, { type PreviewDesign } from "./PreviewDesignCard";
import livingImg from "../../../../assets/hero/modern-livingroom-1.webp";
import contemporaryImg from "../../../../assets/hero/modern-contemporary-1.webp";
import diningImg from "../../../../assets/hero/modern-dininghall-1.webp";

const designs: PreviewDesign[] = [
  {
    img: livingImg,
    name: "Modern living room",
    spaceType: "Living room",
    styles: ["Modern", "Minimal"],
    minPrice: 400000,
    maxPrice: 700000,
    designerName: "Ananya R.",
    rating: 4,
    saved: true,
  },
  {
    img: contemporaryImg,
    name: "Contemporary interior",
    spaceType: "Full home",
    styles: ["Contemporary", "Zen"],
    minPrice: 900000,
    maxPrice: 1500000,
    designerName: "Rahul M.",
    rating: 5,
  },
];

export default function HeroVisual() {
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-xl space-y-4 lg:justify-self-end">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PreviewDesignCard design={designs[0]} />
        <div className="sm:translate-y-6">
          <PreviewDesignCard design={designs[1]} />
        </div>
      </div>

      <div className="flex gap-3 rounded-xl border border-accent bg-surface p-3 shadow-lg sm:mt-10">
        <img
          src={diningImg}
          alt=""
          width={800}
          height={560}
          loading="eager"
          decoding="async"
          className="h-24 w-28 shrink-0 rounded-lg object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <span className="inline-block rounded-full bg-accent-tint px-2.5 py-0.5 text-xs text-accent-tint-text">
                Open job
              </span>
              <span className="shrink-0 text-sm font-medium text-text-primary">₹6L–9L</span>
            </div>
            <h3 className="mt-1.5 truncate font-Jost-Semibold text-text-primary">
              Modern dining hall redesign
            </h3>
            <p className="truncate text-xs text-text-muted">Home · Kochi · 3D plan · Bill of cost</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-faint">3 proposals so far</span>
            <span className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success-tint text-xxs text-success-text">
                ✓
              </span>
              Milestone 1 approved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
