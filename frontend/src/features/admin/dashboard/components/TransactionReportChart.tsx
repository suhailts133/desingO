import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ReportBucketDto } from "../adminDashboardInterface";

interface TransactionReportChartProps {
    data: ReportBucketDto[];
}

export default function TransactionReportChart({ data }: TransactionReportChartProps) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Payment" fill="#4f46e5" />
                <Bar dataKey="Commission" fill="#22c55e" />
                <Bar dataKey="Payout" fill="#f59e0b" />
                <Bar dataKey="Refund" fill="#ef4444" />
            </BarChart>
        </ResponsiveContainer>
    );
}