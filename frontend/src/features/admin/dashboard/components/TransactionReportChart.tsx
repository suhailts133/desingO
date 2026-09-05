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
                <Bar dataKey="Payment" fill="#4f46e5" stackId="a" barSize={50}/>
                <Bar dataKey="Commission" fill="#22c55e" stackId="a" />
                <Bar dataKey="Payout" fill="#f59e0b" stackId="a" />
                <Bar dataKey="Refund" fill="#ef4444" stackId="a" />
            </BarChart>
        </ResponsiveContainer>
    );
}