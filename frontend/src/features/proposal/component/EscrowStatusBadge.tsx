import type { EscrowStatus } from "../proposalInterface"

const ESCROW_STATUS_CONFIG: Record<EscrowStatus,
    { label: string; dot: string; bg: string; border: string; text: string }
> = {
    Held: {
        label: "Payment held in escrow",
        dot: "bg-amber-500",
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
    },
    Released: {
        label: "Payment released to designer",
        dot: "bg-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
    },
    Refunded: {
        label: "Payment refunded to customer",
        dot: "bg-blue-500",
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
    },
    Disputed: {
        label: "Payment under dispute",
        dot: "bg-red-500",
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
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