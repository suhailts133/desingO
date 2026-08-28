import type { AllTransactionDTO, TransactionFilter } from "../transactionInterface";
import Pagination from "../../../../shared/common/Pagination";
import { useGetAllTransactionQuery } from "../transactionEndpoint";
import { useSearchParams } from "react-router-dom";

const transactionTypeStyle: Record<Exclude<AllTransactionDTO["type"], "All">, string> = {
    "Payment": "bg-blue-50 text-blue-700 border-blue-200",
    "Commission": "bg-purple-50 text-purple-700 border-purple-200",
    "Payout": "bg-success/10 text-success border-success/20",
    "Refund": "bg-error/10 text-error border-error/20",
}

export default function TransactionTable() {
    const [searchParms, setSearchParmas] = useSearchParams();

    const page = searchParms.get("page") ?? "1"
    const type = (searchParms.get("type") as TransactionFilter["type"]) ?? "All"


    const { data, isLoading, error } = useGetAllTransactionQuery({
        page: String(page),
        type,
    });

    const transactions = data?.data;
    const totalTransactions = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const handleFilterChange = (key: "type", value: string) => {
        setSearchParmas((prev) => {
            const next = new URLSearchParams(prev)
            next.set(key, value)
            next.set("page", "1")
            return next
        })
    }

    const handlePageChange = (newPage: number) => {
        setSearchParmas((prev) => {
            const next = new URLSearchParams(prev)
            next.set("page", String(newPage))
            return next
        })
    }

    if (isLoading) return <p>Loading...</p>;
    if (error || !transactions) return <p>Error loading transactions</p>;

    return (
        <div className="max-h-screen">
            <div className="mb-6">
                <h1 className="font-Jost-Semibold text-3xl text-soft-black">Transactions</h1>
                <p className="text-soft-black/50 text-sm mt-1">{totalTransactions} transactions found</p>
            </div>

            <form>
                <div className="rounded-2xl flex items-center justify-center gap-3 mb-5 bg-white/50 p-5">
                    <div className="w-45">
                        <select className="auth-input" value={type} onChange={e => handleFilterChange("type", e.target.value)}>
                            <option value="All">All types</option>
                            <option value="Payment">Payment</option>
                            <option value="Commission">Commission</option>
                            <option value="Payout">Payout</option>
                            <option value="Refund">Refund</option>
                        </select>
                    </div>
                </div>
            </form>

            {/* Table */}
            <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(216,160,144,0.15)] overflow-hidden">
                <table className="w-full">
                    <thead className="border-b-2 border-soft-black/20">
                        <tr className="border-b border-white/25 bg-white/20 backdrop-blur-2xl">
                            {["ID", "Type", "Amount"].map((h) => (
                                <th key={h} className="text-left px-5 py-3.5 text-xs font-Jost-Semibold text-soft-black/50 uppercase tracking-widest">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions?.map((transaction: AllTransactionDTO, i: number) => (
                            <tr
                                key={transaction.id}
                                className={`${i % 2 === 0 ? "bg-white/50" : ""} transition-colors duration-150 hover:bg-white/20 ${i !== transactions.length - 1 ? "border-b border-white/20" : ""}`}
                            >
                                <td className="px-5 py-3.5">
                                    <p className="text-soft-black/60 text-sm font-mono">{transaction.id}</p>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-Jost-Semibold border ${transactionTypeStyle[transaction.type as Exclude<AllTransactionDTO["type"], "All">]}`}>
                                        {transaction.type}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <p className="font-Jost-Semibold text-soft-black text-sm">₹{transaction.amount}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    page={Number(page)}
                    totalItem={totalTransactions}
                    whichItem="transactions"
                    totalPages={totalPages}
                    onDecrease={() => handlePageChange(Math.max(1, Number(page) - 1))}
                    onIncrease={() => handlePageChange(Math.min(totalPages, Number(page) + 1))}
                />
            </div>
        </div>
    );
}