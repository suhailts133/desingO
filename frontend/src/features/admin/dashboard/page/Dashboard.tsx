import { useState } from "react";
import { useTransactionReportQuery } from "../../transaction/transactionEndpoint";
import type { ReportQueryParams } from "../adminDashboardInterface";
import TransactionReportChart from "../components/TransactionReportChart";
import TransactionReportFilter from "../components/TransactionReportFilter";

export default function Dashboard() {
    const [queryParams, setQueryParams] = useState<ReportQueryParams>({
        groupBy: "week",
    });

    const { data, isLoading, error } = useTransactionReportQuery(queryParams);
    const transactionReport = data?.data;

    return (
        <div>
            <TransactionReportFilter value={queryParams} onChange={setQueryParams} />

            {isLoading && <p>Loading report...</p>}
            {error && <p>Failed to load report</p>}

            {transactionReport && <TransactionReportChart data={transactionReport.data} />}
        </div>
    );
}