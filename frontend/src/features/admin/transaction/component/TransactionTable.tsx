import { transactionColumns, transactionTypeTone, type AllTransactionDTO, type TransactionFilter } from "../transactionInterface";
import Pagination from "../../../../shared/common/Pagination";
import { useGetAllTransactionQuery } from "../transactionEndpoint";
import { useSearchParams } from "react-router-dom";
import { StatusBadge } from "../../../../shared/table/StatusBadge";
import TableBody from "../../../../shared/table/TableBody";
import TableHeader from "../../../../shared/table/TableHeader";
import UserClickable from "./UserClickable";
import { roleTone, type Role } from "../../users/adminUserInterface";



export default function TransactionTable() {
    const [searchParms, setSearchParmas] = useSearchParams();


    const page = searchParms.get("page") ?? "1";
    const type = (searchParms.get("type") as TransactionFilter["type"]) ?? "All";

    const { data, isLoading, error } = useGetAllTransactionQuery({
        page: String(page),
        type,
    });

    const transactions = data?.data;
    const totalTransactions = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const handleFilterChange = (key: "type", value: string) => {
        setSearchParmas((prev) => {
            const next = new URLSearchParams(prev);
            next.set(key, value);
            next.set("page", "1");
            return next;
        });
    };

    const handlePageChange = (newPage: number) => {
        setSearchParmas((prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", String(newPage));
            return next;
        });
    };


    const cellRenderers = {
        sourceName: (t: AllTransactionDTO) => UserClickable(t.sourceName, t.sourceRole, t.sourceId),
        sourceRole: (t: AllTransactionDTO) => <StatusBadge label={t.sourceRole} tone={roleTone[t.sourceRole as Role] ?? "info"} />,
        designationName: (t: AllTransactionDTO) => UserClickable(t.designationName, t.destinationRole, t.destinationId),
        destinationRole: (t: AllTransactionDTO) => <StatusBadge label={t.destinationRole} tone={roleTone[t.destinationRole as Role] ?? "info"} />,
        type: (t: AllTransactionDTO) => <StatusBadge label={t.type} tone={transactionTypeTone[t.type as Exclude<AllTransactionDTO["type"], "All">]} />,
      
    };

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


            <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(216,160,144,0.15)] overflow-hidden">
                <table className="w-full">
                    <TableHeader columns={transactionColumns} />
                    <TableBody data={transactions} columns={transactionColumns} cellRenderers={cellRenderers} keyExtractor={(u) => u.id} />
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