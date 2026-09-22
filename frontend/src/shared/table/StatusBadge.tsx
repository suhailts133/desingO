export type Tone = "success" | "error" | "warning" | "info" | "neutral" | "archived";

const toneStyles: Record<Tone, string> = {
    success: "bg-success-tint text-success-text",
    error: "bg-error-tint text-error-text",
    warning: "bg-warning-tint text-warning-text",
    info: "bg-accent-tint text-accent-tint-text",
    neutral: "bg-surface-hover text-text-faint",
    archived: "bg-[#232A38] text-[#8B9AB0]",
};

const toneDotStyles: Record<Tone, string> = {
    success: "bg-success",
    error: "bg-error",
    warning: "bg-warning",
    info: "bg-accent",
    neutral: "bg-text-faint",
    archived: "bg-[#5C6E85]",
};

export function StatusBadge({ label, tone, withDot }: { label: string; tone: Tone; withDot?: boolean }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-Jost-Semibold ${toneStyles[tone]}`}>
            {withDot && <span className={`w-1.5 h-1.5 rounded-full ${toneDotStyles[tone]}`} />}
            {label}
        </span>
    );
}