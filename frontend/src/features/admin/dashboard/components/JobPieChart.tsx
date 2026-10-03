import { useGetJobReportQuery } from "../adminDashboardEndpoint";
import { JOB_STATUS_COLORS } from "./statusColors";
import Spinner from "../../../../shared/common/Spinner";
import StatusPieChart from "./StatusPieChart";

export default function JobPieChart() {
  const { data, isLoading, error } = useGetJobReportQuery();
  const report = data?.data;

  if (isLoading) return <Spinner />;
  if (error || !report) return <p className="text-error">Failed to load job report.</p>;

  return (
    <StatusPieChart
      title="Jobs by status"
      data={report.data}
      colors={JOB_STATUS_COLORS}
      total={report.totalValue}
    />
  );
}