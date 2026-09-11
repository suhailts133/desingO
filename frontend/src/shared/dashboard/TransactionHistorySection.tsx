import { History } from "lucide-react"
import type { DashboardTransactionHistory } from "../../features/designer/dashboard/dashboardInterface"
import type { TransactionType } from "../../features/admin/transaction/transactionInterface"

const typeStyles: Record<TransactionType, string> = {
    Payment: "bg-blue-50 text-blue-700 border border-blue-200",
    Commission: "bg-purple-50 text-purple-700 border border-purple-200",
    Payout: "bg-green-50 text-green-800 border border-green-200",
    Refund: "bg-red-50 text-red-700 border border-red-200",
    All: "bg-gray-100 text-gray-700 border border-gray-200",
}

const formatAmount = (amount: number, type: TransactionType) => {
    const sign = type === "Payout" || type === "Refund" ? "-" : "+"
    return `${sign}₹${amount.toLocaleString("en-IN")}`
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
        <div className="bg-off-white rounded-2xl border border-blush-light/40 shadow-lg px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
                <History size={20} className="text-blush-deep" />
                <p className="text-base font-semibold text-soft-black">Recent transactions</p>
            </div>

            {transactions.length === 0 ? (
                <p className="text-sm text-soft-black/40">No recent transactions.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {transactions.map((tx) => (
                        <li
                            key={tx.id}
                            className="flex items-center justify-between gap-3 border-b border-blush-light/30 last:border-b-0 pb-3 last:pb-0"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-soft-black truncate">{tx.from}</p>
                                <p className="text-xs text-soft-black/50">{formatDate(tx.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${typeStyles[tx.type]}`}>
                                    {tx.type}
                                </span>
                                <span
                                    className={`text-sm font-semibold ${tx.type === "Payout" || tx.type === "Refund" ? "text-red-600" : "text-green-700"
                                        }`}
                                >
                                    {formatAmount(tx.amount, tx.type)}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}