import { useMemo } from "react";
import { Legend, Pie, PieChart, Tooltip } from "recharts";

interface Props<T extends string> {
  title: string;
  data: { name: T; value: number }[];
  colors: Record<T, string>;
  total: number;
}

export default function StatusPieChart<T extends string>({
  title,
  data,
  colors,
  total,
}: Props<T>) {
  // fill is added here so the source data stays clean
  const chartData = useMemo(
    () => data.map((d) => ({ ...d, fill: colors[d.name] })),
    [data, colors],
  );

  return (
    <div className="flex h-full flex-col rounded-lg border border-surface-border bg-surface p-4">
      <h3 className="text-sm font-medium text-text-primary">
        {title}
        <span className="ml-2 text-text-muted">Total: {total}</span>
      </h3>

      {total === 0 ? (
        <p className="flex flex-1 items-center justify-center py-12 text-sm text-text-muted">
          No data yet
        </p>
      ) : (
        <PieChart
          style={{ width: "100%", maxWidth: 360, aspectRatio: 1, margin: "0 auto" }}
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
            formatter={(value, name) => [`${value}`, name]}
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
      )}
    </div>
  );
}