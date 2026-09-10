export type Tone = "success" | "error" | "warning" | "info" | "neutral";

const toneStyles: Record<Tone, string> = {
    success: "bg-success/10 text-success border border-success/20",
    error: "bg-error/10 text-error border border-error/20",
    warning: "bg-peach/20 text-blush-deep border border-peach/30",
    info: "bg-blush/20 text-soft-black border border-blush/30",
    neutral: "bg-white/30 text-soft-black/60 border border-white/40",
};

export function StatusBadge({ label, tone, withDot }: { label: string; tone: Tone; withDot?: boolean }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-Jost-Semibold ${toneStyles[tone]}`}>
            {withDot && <span className={`w-1.5 h-1.5 rounded-full bg-${tone}`} />}
            {label}
        </span>
    );
}