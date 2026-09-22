import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ReportBucketDto } from "../adminDashboardInterface";

interface TransactionReportChartProps {
    data: ReportBucketDto[];
}

export default function TransactionReportChart({ data }: TransactionReportChartProps) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-border)" />
                <XAxis dataKey="period" stroke="var(--color-text-faint)" />
                <YAxis stroke="var(--color-text-faint)" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "var(--color-surface)",
                        border: "1px solid var(--color-surface-border)",
                        color: "var(--color-text-primary)",
                    }}
                />
                <Legend wrapperStyle={{ color: "var(--color-text-muted)" }} />
                <Bar dataKey="Payment" fill="var(--color-accent)" stackId="a" barSize={50}/>
                <Bar dataKey="Commission" fill="var(--color-success)" stackId="a" />
                <Bar dataKey="Payout" fill="var(--color-warning)" stackId="a" />
                <Bar dataKey="Refund" fill="var(--color-error)" stackId="a" />
            </BarChart>
        </ResponsiveContainer>
    );
}