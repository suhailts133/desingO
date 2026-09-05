import { useCallback, useState } from "react";
import { useTransactionReportQuery } from "../../transaction/transactionEndpoint";
import type { ReportQueryParams } from "../adminDashboardInterface";
import TransactionReportChart from "../components/TransactionReportChart";
import TransactionReportFilter from "../components/TransactionReportFilter";
import { exportTransactionReportToExcel } from "../../../../helpers/exportTransactionReport";

export default function Dashboard() {
    const [queryParams, setQueryParams] = useState<ReportQueryParams>({
        groupBy: "week",
    });

    const { data, isLoading, error } = useTransactionReportQuery(queryParams);
    const transactionReport = data?.data;
    const handleDownload = useCallback(async () => {
        if (!transactionReport) return;
        await exportTransactionReportToExcel(transactionReport.data, transactionReport.groupBy);
    }, [transactionReport]);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <TransactionReportFilter value={queryParams} onChange={setQueryParams} />
                <button
                    type="button"
                    onClick={() => void handleDownload()}
                    disabled={!transactionReport}
                    className="inline-flex items-center gap-2 rounded-md bg-soft-black px-3 py-2 text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Download Excel
                </button>
            </div>

            {isLoading && <p>Loading report...</p>}
            {error && <p>Failed to load report</p>}

            {transactionReport && <TransactionReportChart data={transactionReport.data} />}
        </div>
    );
}