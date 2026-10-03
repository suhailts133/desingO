import { useGetAdminDashboardQuery, useGetJobReportQuery } from "../adminDashboardEndpoint";
import DashboardStats from "../components/DashboardStats";
import TransactionReportSection from "../components/TransactionReportSection";
import JobStatusPieChart from "../components/JobStatusPieChart";
import AdminOngoingDisputesSection from "../components/AdminOngoingDisputesSection";
import PendingVerificationRequestsSection from "../components/PendingVerificationRequestsSection ";
import Spinner from "../../../../shared/common/Spinner";

export default function Dashboard() {
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } =
    useGetAdminDashboardQuery();
  const { data: jobReportData, isLoading: isJobReportLoading, error: jobReportError } =
    useGetJobReportQuery();

  const dashboard = dashboardData?.data;
  const jobReport = jobReportData?.data?.data;
  const totalJobs = jobReportData?.data?.totalValue ?? 0;

  if (isDashboardLoading || isJobReportLoading) return <Spinner />;
  if (dashboardError || jobReportError)
    return <p className="text-error">Failed to load the dashboard. Please try again later.</p>;

  return (
    <div className="flex flex-col gap-6">
      <DashboardStats
        activeUsersCount={dashboard?.activeUsersCount}
        activeJobCount={dashboard?.activeJobCount}
        totalCommision={dashboard?.totalCommision}
        totalRefund={dashboard?.totalRefund}
      />

      <TransactionReportSection />

      {jobReport && <JobStatusPieChart data={jobReport} total={totalJobs} />}

      {dashboard && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminOngoingDisputesSection disputes={dashboard.disputes} />
          <PendingVerificationRequestsSection requests={dashboard.designerVerificationRequests} />
        </div>
      )}
    </div>
  );
}