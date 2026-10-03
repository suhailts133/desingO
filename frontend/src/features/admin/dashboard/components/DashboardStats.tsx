import { Users, Briefcase, Percent, Undo2 } from "lucide-react";
import StatCard from "../../../../shared/dashboard/StatCard";

interface Props {
  activeUsersCount?: number;
  activeJobCount?: number;
  totalCommision?: number;
  totalRefund?: number;
}

const rupees = (n?: number) => (n === undefined ? "—" : `₹${n.toLocaleString("en-IN")}`);

export default function DashboardStats({
  activeUsersCount,
  activeJobCount,
  totalCommision,
  totalRefund,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Users} label="Active users" value={activeUsersCount ?? "—"} />
      <StatCard icon={Briefcase} label="Active jobs" value={activeJobCount ?? "—"} />
      <StatCard icon={Percent} label="Total commission" value={rupees(totalCommision)} />
      <StatCard icon={Undo2} label="Total Refund" value={rupees(totalRefund)} />
    </div>
  );
}