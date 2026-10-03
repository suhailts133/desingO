import DisputePieChart from "./DisputePieChart";
import JobPieChart from "./JobPieChart";

export default function StatusChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <JobPieChart />
      <DisputePieChart />
    </div>
  );
}