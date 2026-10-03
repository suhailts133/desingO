import { useCallback, useState } from "react";
import { useTransactionReportQuery } from "../../transaction/transactionEndpoint";
import type { ReportQueryParams } from "../adminDashboardInterface";
import TransactionReportChart from "./TransactionReportChart";
import TransactionReportFilter from "./TransactionReportFilter";
import { exportTransactionReportToExcel } from "../../../../helpers/exportTransactionReport";
import Spinner from "../../../../shared/common/Spinner";

export default function TransactionReportSection() {
  const [queryParams, setQueryParams] = useState<ReportQueryParams>({
    groupBy: "week",
  });

  const { data, isLoading, isFetching, error } = useTransactionReportQuery(queryParams);
  const report = data?.data;

  const handleDownload = useCallback(async () => {
    if (!report) return;
    await exportTransactionReportToExcel(report.data, report.groupBy);
  }, [report]);

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-error">Failed to load the transaction report.</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <TransactionReportFilter value={queryParams} onChange={setQueryParams} />
        <button
          type="button"
          onClick={() => void handleDownload()}
          disabled={!report}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-text-on-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Download Excel
        </button>
      </div>

      {report && (
        <div className={`transition-opacity ${isFetching ? "opacity-50" : ""}`}>
          <TransactionReportChart data={report.data} />
        </div>
      )}
    </div>
  );
}