import type { TransactionType } from "../../features/admin/transaction/transactionInterface";
import type { DashboardTransactionHistory } from "../../features/designer/dashboard/dashboardInterface";

const typeStyles: Record<TransactionType, string> = {
    Payment: "bg-surface-hover text-text-muted border border-surface-border",
    Commission: "bg-surface-hover text-text-muted border border-surface-border",
    Payout: "bg-surface-hover text-text-muted border border-surface-border",
    Refund: "bg-surface-hover text-text-muted border border-surface-border",
    All: "bg-surface-hover text-text-muted border border-surface-border",
};

interface TransactionHistoryTableProps {
    transactions: DashboardTransactionHistory[];
}

export default function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
    if (transactions.length === 0) {
        return (
            <div className="flex items-center justify-center py-16 text-text-muted">
                No transactions found
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-surface-border">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-bg-raised text-text-muted border-b border-surface-border">
                        <th className="text-left font-medium px-4 py-3">Transaction ID</th>
                        <th className="text-left font-medium px-4 py-3">Type</th>
                        <th className="text-left font-medium px-4 py-3">From</th>
                        <th className="text-left font-medium px-4 py-3">Date</th>
                        <th className="text-right font-medium px-4 py-3">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <tr
                            key={tx.id}
                            className="border-b border-surface-border last:border-0 hover:bg-surface-hover"
                        >
                            <td className="px-4 py-3 text-text-primary font-mono text-xs">
                                {tx.transactionId}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${typeStyles[tx.type]}`}
                                >
                                    {tx.type}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-text-primary">{tx.from}</td>
                            <td className="px-4 py-3 text-text-muted">
                                {tx.createdAt}
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-text-primary">
                                ₹{tx.amount.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}