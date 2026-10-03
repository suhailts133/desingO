import { useMemo } from "react";
import { Legend, Pie, PieChart, Tooltip } from "recharts";
import type { IStatusStat } from "../adminDashboardInterface";
import type { JobStatus } from "../../../user/jobs/jobInterface";

const STATUS_COLORS: Record<JobStatus, string> = {
  Pending: "var(--color-warning)",
  Ongoing: "var(--color-accent)",
  Closed: "var(--color-text-muted)",
  Terminated: "var(--color-error)",
  Rejected: "var(--color-text-faint)",
};

interface Props {
  data: IStatusStat[];
  total: number;
}

export default function JobStatusPieChart({ data, total }: Props) {
  const chartData = useMemo(
    () => data.map((d) => ({ ...d, fill: STATUS_COLORS[d.name] })),
    [data],
  );

  return (
    <div className="rounded-lg border border-surface-border bg-surface p-4">
      <h3 className="text-sm font-medium text-text-primary">
        Total Jobs {total}
      </h3>

      <PieChart
        style={{ width: "100%", maxWidth: 420, aspectRatio: 1, margin: "0 auto" }}
        responsive
      >
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          stroke="var(--color-surface)"
          label={({ value, percent }) =>
            `${value} (${((percent ?? 0) * 100).toFixed(0)}%)`
          }
        />
        <Tooltip
          formatter={(value, name) => [`${value} jobs`, name]}
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-surface-border)",
            borderRadius: 8,
            color: "var(--color-text-primary)",
          }}
        />
        <Legend
          formatter={(name) =>
            `${name} (${data.find((d) => d.name === name)?.value ?? 0})`
          }
        />
      </PieChart>
    </div>
  );
}