import { useGetAdminDashboardQuery } from "../adminDashboardEndpoint";
import DashboardStats from "../components/DashboardStats";
import TransactionReportSection from "../components/TransactionReportSection";
import AdminOngoingDisputesSection from "../components/AdminOngoingDisputesSection";
import PendingVerificationRequestsSection from "../components/PendingVerificationRequestsSection ";
import Spinner from "../../../../shared/common/Spinner";
import StatusChartsSection from "../components/StatusChartsSection";

export default function Dashboard() {
  const { data, isLoading, error } = useGetAdminDashboardQuery();
  const dashboard = data?.data;

  if (isLoading) return <Spinner />;
  if (error || !dashboard)
    return <p className="text-error">Failed to load the dashboard. Please try again later.</p>;

  return (
    <div className="flex flex-col gap-6">
      <DashboardStats
        activeUsersCount={dashboard.activeUsersCount}
        activeJobCount={dashboard.activeJobCount}
        totalCommision={dashboard.totalCommision}
        totalRefund={dashboard.totalRefund}
      />

      <TransactionReportSection />
      <StatusChartsSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminOngoingDisputesSection disputes={dashboard.disputes} />
        <PendingVerificationRequestsSection requests={dashboard.designerVerificationRequests} />
      </div>
    </div>
  );
}