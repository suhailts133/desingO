import { useState } from "react"
import type { EscrowStatus, PaymentStatus } from "../proposalInterface"

interface PaymentSummaryProps {
    price: number
    executionPrice: number
    paymentStatus: PaymentStatus
    escrowStatus?: EscrowStatus
    amountHeld?: number
    platformFee?: number
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-4 py-1.5">
            <dt className={`text-xs ${strong ? "font-medium text-text-primary" : muted ? "text-text-faint" : "text-text-muted"}`}>
                {label}
            </dt>
            <dd className={`text-xs tabular-nums ${strong ? "font-semibold" : ""} ${muted ? "text-text-muted" : "text-text-primary"}`}>
                {value}
            </dd>
        </div>
    )
}

function Collapsible({
    title,
    summaryLabel,
    summaryValue,
    defaultOpen = false,
    children,
}: {
    title: string
    summaryLabel: string
    summaryValue: string
    defaultOpen?: boolean
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className="rounded-lg border border-surface-border bg-bg-raised">
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left"
            >
                <span className="text-[10px] font-medium uppercase tracking-wider text-text-faint">
                    {title}
                </span>
                <span className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">
                        {summaryLabel}{" "}
                        <span className="font-semibold tabular-nums text-text-primary">{summaryValue}</span>
                    </span>
                    <svg
                        className={`w-3 h-3 text-text-faint transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            {open && (
                <div className="px-3 pb-2.5 border-t border-surface-border">
                    {children}
                </div>
            )}
        </div>
    )
}

export default function PaymentSummary({
    price,
    executionPrice,
    paymentStatus,
    escrowStatus,
    amountHeld,
    platformFee,
}: PaymentSummaryProps) {
    const total = price + executionPrice
    const hasEscrowDetails = amountHeld !== undefined || platformFee !== undefined

    const payout =
        amountHeld !== undefined &&
        platformFee !== undefined &&
        (escrowStatus === "Held" || escrowStatus === "Released")
            ? amountHeld - platformFee
            : undefined

    return (
        <div className="flex flex-col gap-2">
            {/* Charges */}
            <Collapsible title="Charges" summaryLabel="Total" summaryValue={inr(total)}>
                <dl className="divide-y divide-surface-border">
                    <Row label="Service fee" value={inr(price)} />
                    <Row label="Execution fee" value={inr(executionPrice)} />
                </dl>
                <div className="border-t border-surface-border-strong">
                    <Row label="Total" value={inr(total)} strong />
                </div>
            </Collapsible>

            {/* Escrow breakdown */}
            {hasEscrowDetails ? (
                <Collapsible
                    title="Escrow breakdown"
                    summaryLabel={escrowStatus === "Released" ? "Released" : "Held"}
                    summaryValue={amountHeld !== undefined ? inr(amountHeld) : "—"}
                >
                    <dl className="divide-y divide-surface-border">
                        {amountHeld !== undefined && <Row label="Amount held" value={inr(amountHeld)} />}
                        {platformFee !== undefined && (
                            <Row label="Platform commission" value={`− ${inr(platformFee)}`} muted />
                        )}
                    </dl>
                    {payout !== undefined && (
                        <div className="border-t border-surface-border-strong">
                            <Row
                                label={escrowStatus === "Released" ? "Paid to designer" : "Designer payout"}
                                value={inr(payout)}
                                strong
                            />
                        </div>
                    )}
                </Collapsible>
            ) : (
                paymentStatus === "Pending" && (
                    <div className="rounded-lg border border-surface-border bg-bg-raised px-3 py-2.5">
                        <p className="text-[11px] text-text-faint">
                            Escrow details will appear once payment is made.
                        </p>
                    </div>
                )
            )}
        </div>
    )
}