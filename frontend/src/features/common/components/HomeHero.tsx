import HeroCollage from "./HeroCollage";

type HomeHeroProps = {
  onPostJob?: () => void;
  onBrowseDesigners?: () => void;
};

export default function HomeHero({ onPostJob, onBrowseDesigners }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden px-6 py-16 sm:py-24">

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-5 flex items-center gap-2.5 text-sm text-text-muted">
            <span className="h-px w-4 bg-accent" />
            For homeowners and interior designers
          </div>

          <h1 className="font-Jost-Semibold text-4xl leading-[1.1] text-text-primary sm:text-5xl">
            Great rooms start with the right person, not the right app.
          </h1>

          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-text-muted">
            designO connects people who need a space designed with designers
            who've already done the work. Post what you need, or find it
            already made.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onPostJob}
              className="rounded-md bg-accent px-5 py-2.5 font-medium text-text-on-accent transition-colors hover:bg-accent-hover"
            >
              Post a job
            </button>
            <button
              type="button"
              onClick={onBrowseDesigners}
              className="rounded-md border border-surface-border-strong px-5 py-2.5 font-medium text-text-primary transition-colors hover:border-accent"
            >
              Browse designers
            </button>
          </div>
        </div>

        <HeroCollage />
      </div>
    </section>
  );
}