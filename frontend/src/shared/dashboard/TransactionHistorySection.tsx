import { History } from "lucide-react"
import type { DashboardTransactionHistory } from "../../features/designer/dashboard/dashboardInterface"
import type { TransactionType } from "../../features/admin/transaction/transactionInterface"

const typeStyles: Record<TransactionType, string> = {
    Payment: "bg-surface-hover text-text-muted border border-surface-border",
    Commission: "bg-surface-hover text-text-muted border border-surface-border",
    Payout: "bg-surface-hover text-text-muted border border-surface-border",
    Refund: "bg-surface-hover text-text-muted border border-surface-border",
    All: "bg-surface-hover text-text-muted border border-surface-border",
}

const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
}

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })

type Props = {
    transactions: DashboardTransactionHistory[]
}

export default function TransactionHistorySection({ transactions }: Props) {
    return (
        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <History size={20} className="text-accent" />
                <p className="text-base font-semibold text-text-primary">Recent transactions</p>
            </div>

            {transactions.length === 0 ? (
                <p className="text-sm text-text-faint">No recent transactions.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {transactions.map((tx) => (
                        <li
                            key={tx.id}
                            className="flex items-center justify-between gap-3 border-b border-surface-border last:border-b-0 pb-3 last:pb-0"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">{tx.from}</p>
                                <p className="text-xs text-text-faint">{formatDate(tx.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${typeStyles[tx.type]}`}>
                                    {tx.type}
                                </span>
                                <span className="text-sm font-semibold text-success">
                                    {formatAmount(tx.amount)}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}