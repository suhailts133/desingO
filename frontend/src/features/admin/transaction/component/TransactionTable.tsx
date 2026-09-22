import { type AllTransactionDTO } from "../transactionInterface";
import Pagination from "../../../../shared/common/Pagination";
import { useGetAllTransactionQuery } from "../transactionEndpoint";
import { StatusBadge } from "../../../../shared/table/StatusBadge";
import TableBody from "../../../../shared/table/TableBody";
import TableHeader from "../../../../shared/table/TableHeader";
import UserClickable from "./UserClickable";
import { type Role } from "../../users/adminUserInterface";
import { roleTone } from "../../users/adminUserColumn";
import { transactionColumns, transactionTypeTone } from "../transactionColumn";
import { useFilterParams } from "../../../../shared/filter/useFilterParams";
import { FilterBar } from "../../../../shared/filter/FilterBar";
import { TRANSACTION_FILTERS } from "../transactionFilter";


export default function TransactionTable() {
    const { searchParams, getValue, setFilter, setPage } = useFilterParams();

    const page = Number(searchParams.get("page") ?? "1");
    const type = getValue("type") as AllTransactionDTO["type"] | "All";

    const { data, isLoading, error } = useGetAllTransactionQuery({
        page: String(page),
        type,
    });

    const transactions = data?.data;
    const totalTransactions = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;

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
                <h1 className="font-Jost-Semibold text-3xl text-accent">Transactions</h1>
                <p className="text-text-primary text-sm mt-1">{totalTransactions} transactions found</p>
            </div>

            <FilterBar filters={TRANSACTION_FILTERS} getValue={getValue} onFilterChange={setFilter} />

            <div className="bg-surface backdrop-blur-2xl border border-surface-border rounded-2xl  overflow-hidden">
                <table className="w-full">
                    <TableHeader columns={transactionColumns} />
                    <TableBody data={transactions} columns={transactionColumns} cellRenderers={cellRenderers} keyExtractor={(u) => u.id} />
                </table>

                <Pagination
                    page={page}
                    totalItem={totalTransactions}
                    whichItem="transactions"
                    totalPages={totalPages}
                    onDecrease={() => setPage(Math.max(1, page - 1))}
                    onIncrease={() => setPage(Math.min(totalPages, page + 1))}
                />
            </div>
        </div>
    );
}