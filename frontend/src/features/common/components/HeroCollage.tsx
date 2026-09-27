type ThumbTone = "accent" | "success" | "warning";

function ThumbIcon({ tone, children }: { tone: ThumbTone; children: React.ReactNode }) {
  const bg =
    tone === "accent" ? "bg-accent-tint" : tone === "success" ? "bg-success-tint" : "bg-warning-tint";
  const stroke =
    tone === "accent" ? "stroke-accent" : tone === "success" ? "stroke-success" : "stroke-warning";
  return (
    <div className={`flex h-10 w-13 items-center justify-center rounded ${bg}`}>
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className={`h-5.5 w-5.5 ${stroke}`}>
        {children}
      </svg>
    </div>
  );
}

export default function HeroCollage() {
  return (
    <div className="relative h-100">
      {/* Illustrated room scene — stands in for a real project photo */}
      <div className="absolute left-1 top-0 h-57 w-75 -rotate-1 overflow-hidden rounded-xl border border-surface-border shadow-2xl sm:w-[320px]">
        <svg viewBox="0 0 320 228" className="h-full w-full">
          <rect width="320" height="228" className="fill-surface" />
          <rect x="0" y="168" width="320" height="60" className="fill-bg-raised" />
          <rect x="22" y="18" width="66" height="92" rx="4" className="fill-accent-tint stroke-surface-border-strong" />
          <line x1="55" y1="18" x2="55" y2="110" className="stroke-surface-border-strong" />
          <line x1="22" y1="64" x2="88" y2="64" className="stroke-surface-border-strong" />
          <rect x="140" y="26" width="42" height="58" rx="2" className="fill-bg-raised stroke-surface-border-strong" />
          <path
            d="M148 74 L162 46 L174 66"
            fill="none"
            className="stroke-accent"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="150" cy="190" rx="95" ry="16" className="fill-warning" opacity={0.25} />
          <rect x="112" y="128" width="150" height="46" rx="12" className="fill-accent" />
          <rect x="106" y="110" width="36" height="40" rx="10" className="fill-accent" />
          <rect x="248" y="110" width="36" height="40" rx="10" className="fill-accent" />
          <rect x="128" y="124" width="46" height="18" rx="6" className="fill-accent-hover" />
          <rect x="182" y="124" width="46" height="18" rx="6" className="fill-accent-hover" />
          <line x1="284" y1="60" x2="284" y2="168" className="stroke-surface-border-strong" strokeWidth={2} />
          <path d="M270 60 Q284 44 298 60" fill="none" className="stroke-surface-border-strong" strokeWidth={2} />
          <rect x="252" y="150" width="26" height="18" rx="3" className="fill-surface-hover" />
          <ellipse cx="258" cy="140" rx="9" ry="16" className="fill-success" />
          <ellipse cx="268" cy="136" rx="8" ry="15" className="fill-success" opacity={0.85} />
          <ellipse cx="263" cy="146" rx="7" ry="13" className="fill-success" opacity={0.7} />
        </svg>
      </div>

      {/* Designer profile preview */}
      <div className="absolute right-0 top-47.5 w-65 rotate-3 rounded-xl border border-surface-border bg-surface p-4 shadow-2xl">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="h-9 w-9 shrink-0 rounded-full bg-surface-hover" />
          <div>
            <p className="text-sm font-medium text-text-primary">Ananya R.</p>
            <p className="text-xs text-text-muted">Interior Designer · 12 projects</p>
          </div>
        </div>
        <div className="mb-3 flex gap-1.5">
          <ThumbIcon tone="accent">
            <rect x="3" y="11" width="18" height="7" rx="2" />
            <path d="M5 11V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" />
          </ThumbIcon>
          <ThumbIcon tone="success">
            <path d="M12 21V10" />
            <path d="M12 10c0-4 3-6 6-6 0 4-2 6-6 6Z" />
            <path d="M12 13c0-3-2.5-5-5-5 0 3 2 5 5 5Z" />
          </ThumbIcon>
          <ThumbIcon tone="warning">
            <path d="M9 4h6l-1.5 6H10.5L9 4Z" />
            <line x1="12" y1="10" x2="12" y2="19" />
            <line x1="8" y1="19" x2="16" y2="19" />
          </ThumbIcon>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">Kochi, Kerala</span>
          <span className="rounded-md border border-surface-border-strong px-2.5 py-1 text-xs text-text-primary">
            Message
          </span>
        </div>
      </div>

      {/* Job post preview */}
      <div className="absolute bottom-0 left-6 w-67.5 -rotate-3 rounded-xl border border-surface-border bg-surface p-4 shadow-2xl">
        <span className="mb-3 inline-block rounded-full bg-accent-tint px-2.5 py-0.5 text-xs text-accent-tint-text">
          Open job
        </span>
        <h3 className="mb-1 font-Jost-Semibold text-text-primary">Modern kitchen refresh</h3>
        <p className="mb-4 text-xs text-text-muted">₹6L–9L budget · Kochi</p>
        <div className="flex items-center justify-between">
          <div className="flex">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="-ml-2 h-5.5 w-5.5 rounded-full border-2 border-surface bg-surface-hover first:ml-0"
              />
            ))}
          </div>
          <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-text-on-accent">
            3 proposals
          </span>
        </div>
      </div>
    </div>
  );
}