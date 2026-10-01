import HeroVisual from "./HeroVisual";

type HomeHeroProps = {
  onPostJob?: () => void;
  onBrowseDesigners?: () => void;
  onBecomeDesigner?: () => void;
  onBrowseJobs?: () => void;
  onTryAI?: () => void;
};

export default function HomeHero({
  onPostJob,
  onBrowseDesigners,
  onBecomeDesigner,
  onBrowseJobs,
  onTryAI,
}: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden bg-bg px-6 py-16 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-120 w-120 rounded-full bg-accent-tint opacity-70 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* left: content */}
        <div>
          <p className="mb-4 flex items-center gap-2 text-sm text-text-muted">
            <span className="h-px w-4 bg-accent" />
            Interior design for homes, offices and every space in between
          </p>

          <h1 className="font-Jost-Semibold text-4xl leading-[1.1] text-text-primary sm:text-5xl">
            Where great spaces meet the designers who create them.
          </h1>

          <p className="mt-5 max-w-[50ch] text-lg leading-relaxed text-text-muted">
            Browse real projects from verified interior designers, or post what
            you need and let them come to you. Every payment is released
            milestone by milestone, only for work you approve.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onPostJob}
              className="rounded-md bg-accent px-5 py-2.5 font-medium text-text-on-accent transition-colors hover:bg-accent-hover active:bg-accent-active"
            >
              Post a job
            </button>
            <button
              type="button"
              onClick={onBrowseDesigners}
              className="rounded-md border border-surface-border-strong px-5 py-2.5 font-medium text-text-primary transition-colors hover:border-accent hover:bg-surface-hover"
            >
              Browse designers
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {onTryAI && (
              <button
                type="button"
                onClick={onTryAI}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
              >
                Try AI design <span aria-hidden>→</span>
              </button>
            )}
            <div className="mt-6 flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-tint text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 stroke-current"
                    aria-hidden
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Are you an interior designer?
                  </p>
                  <p className="text-xs text-text-muted">
                    Find clients and get paid per milestone.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onBrowseJobs}
                  className="rounded-md border border-surface-border-strong px-3.5 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:bg-surface-hover"
                >
                  Browse jobs
                </button>
                <button
                  type="button"
                  onClick={onBecomeDesigner}
                  className="rounded-md bg-accent-tint px-3.5 py-2 text-sm font-medium text-accent-tint-text transition-colors hover:bg-surface-hover"
                >
                  Apply to join
                </button>
              </div>
            </div>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-surface-border pt-6 text-sm text-text-muted">
            {[
              "Verified designers",
              "Pay per milestone",
              "Dispute protection",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* right: visual */}
        <HeroVisual />
      </div>
    </section>
  );
}
