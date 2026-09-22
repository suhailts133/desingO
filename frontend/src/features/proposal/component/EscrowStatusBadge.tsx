import type { EscrowStatus } from "../proposalInterface"

const ESCROW_STATUS_CONFIG: Record<EscrowStatus,
    { label: string; dot: string; bg: string; border: string; text: string }
> = {
    Held: {
        label: "Payment held in escrow",
        dot: "bg-warning",
        bg: "bg-warning-tint",
        border: "border-warning",
        text: "text-warning-text",
    },
    Released: {
        label: "Payment released to designer",
        dot: "bg-success",
        bg: "bg-success-tint",
        border: "border-success",
        text: "text-success-text",
    },
    Refunded: {
        label: "Payment refunded to customer",
        dot: "bg-accent",
        bg: "bg-accent-tint",
        border: "border-surface-border",
        text: "text-accent-tint-text",
    },
    Disputed: {
        label: "Payment under dispute",
        dot: "bg-error",
        bg: "bg-error-tint",
        border: "border-error",
        text: "text-error-text",
    },
};

export default function EscrowStatusBadge({ status, amount }: { status: EscrowStatus, amount: number }) {
    const config = ESCROW_STATUS_CONFIG[status];

    return (
        <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.bg} ${config.border} ${config.text}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label} ₹{amount.toLocaleString("en-IN")}
        </div>
    );
}