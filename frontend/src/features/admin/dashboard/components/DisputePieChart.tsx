import { useGetDisputeReportQuery } from "../adminDashboardEndpoint";

import { DISPUTE_STATUS_COLORS } from "./statusColors";
import Spinner from "../../../../shared/common/Spinner";
import StatusPieChart from "./StatusPieChart";

export default function DisputePieChart() {
  const { data, isLoading, error } = useGetDisputeReportQuery();
  const report = data?.data;

  if (isLoading) return <Spinner />;
  if (error || !report) return <p className="text-error">Failed to load dispute report.</p>;

  return (
    <StatusPieChart
      title="Disputes by status"
      data={report.data}
      colors={DISPUTE_STATUS_COLORS}
      total={report.totalValue}
    />
  );
}