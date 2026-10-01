import { useSearchParams } from "react-router-dom";
import Pagination from "../../../shared/common/Pagination"
import { useGetTransactionHistoryQuery } from "../commonEndpoints"
import TransactionHistoryTable from "../../../shared/common/TransactionHistoryTable";
import Spinner from "../../../shared/common/Spinner";

export default function TransactionHistoryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? "1");
    const { data, error, isLoading } = useGetTransactionHistoryQuery(String(page))
    const handlePageChange = (newPage: number) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", String(newPage));
            return next;
        });
    };

    const transactionData = data?.data
    const totalTransaction = data?.total ?? 0
    const totalPages = data?.totalPages ?? 0

    if (isLoading) {
        return <Spinner/>
    }

    if (error || !transactionData) {
        return <div>Error while loading</div>
    }
    console.log(transactionData)

    return (
        <div className="w-full flex flex-col gap-6 min-h-full">
            <h1 className="text-text-primary text-lg font-medium px-4 pt-4">Transaction History</h1>

            <div className="flex-1 px-4 py-4">
                <TransactionHistoryTable transactions={transactionData} />
            </div>

            <div className="sticky bottom-0 mt-auto pt-4 bg-bg">
                <Pagination
                    page={page}
                    totalItem={totalTransaction}
                    whichItem="transaction"
                    totalPages={totalPages}
                    onDecrease={() => handlePageChange(Math.max(1, page - 1))}
                    onIncrease={() => handlePageChange(Math.min(totalPages, page + 1))}
                />
            </div>
        </div>
    )
}
