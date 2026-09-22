import { useCallback, useState } from "react";
import { Users, Briefcase, Percent } from "lucide-react";
import { useTransactionReportQuery } from "../../transaction/transactionEndpoint";
import type { ReportQueryParams } from "../adminDashboardInterface";
import TransactionReportChart from "../components/TransactionReportChart";
import TransactionReportFilter from "../components/TransactionReportFilter";
import { exportTransactionReportToExcel } from "../../../../helpers/exportTransactionReport";
import { useGetAdminDashboardQuery } from "../adminDashboardEndpoint";
import StatCard from "../../../../shared/dashboard/StatCard";
import AdminOngoingDisputesSection from "../components/AdminOngoingDisputesSection";
import PendingVerificationRequestsSection from "../components/PendingVerificationRequestsSection ";

export default function Dashboard() {
    const [queryParams, setQueryParams] = useState<ReportQueryParams>({
        groupBy: "week",
    });

    const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useGetAdminDashboardQuery();
    const { data: reportData, isLoading: isReportLoading, error: reportError } = useTransactionReportQuery(queryParams);

    const dashboard = dashboardData?.data;
    const transactionReport = reportData?.data;

    const handleDownload = useCallback(async () => {
        if (!transactionReport) return;
        await exportTransactionReportToExcel(transactionReport.data, transactionReport.groupBy);
    }, [transactionReport]);

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={Users} label="Active users" value={dashboard?.activeUsersCount ?? "—"} />
                <StatCard icon={Briefcase} label="Active jobs" value={dashboard?.activeJobCount ?? "—"} />
                <StatCard icon={Percent} label="Total commission" value={`₹${dashboard?.totalCommision.toLocaleString("en-IN")}`} />
            </div>

            <div className="flex items-center justify-between">
                <TransactionReportFilter value={queryParams} onChange={setQueryParams} />
                <button
                    type="button"
                    onClick={() => void handleDownload()}
                    disabled={!transactionReport}
                    className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-text-on-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Download Excel
                </button>
            </div>

            {isReportLoading && <p className="text-text-muted">Loading report...</p>}
            {reportError && <p className="text-error">Failed to load report</p>}
            {transactionReport && <TransactionReportChart data={transactionReport.data} />}

            {isDashboardLoading && <p className="text-text-muted">Loading dashboard...</p>}
            {dashboardError && <p className="text-error">Failed to load dashboard</p>}
            {dashboard && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AdminOngoingDisputesSection disputes={dashboard.disputes} />
                    <PendingVerificationRequestsSection requests={dashboard.designerVerificationRequests} />
                </div>
            )}
        </div>
    );
}