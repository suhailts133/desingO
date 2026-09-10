import writeXlsxFile from "write-excel-file/browser";
import type { ReportBucketDto, ReportGroupBy } from "../features/admin/dashboard/adminDashboardInterface";


const HEADER_ROW = [
    { value: "Period", fontWeight: "bold" as const },
    { value: "Total", fontWeight: "bold" as const },
    { value: "Count", fontWeight: "bold" as const },
    { value: "Payment", fontWeight: "bold" as const },
    { value: "Commission", fontWeight: "bold" as const },
    { value: "Payout", fontWeight: "bold" as const },
    { value: "Refund", fontWeight: "bold" as const },
];

/**
 * Builds an Excel file from transaction report buckets and triggers a download
 * @param data report buckets to export
 * @param groupBy grouping used for the report, included in the filename
 */
export async function exportTransactionReportToExcel(data: ReportBucketDto[], groupBy: ReportGroupBy,): Promise<void> {
    const rows = data.map((bucket) => [
        { value: bucket.period, type: String },
        { value: bucket.total, type: Number },
        { value: bucket.count, type: Number },
        { value: bucket.Payment, type: Number },
        { value: bucket.Commission, type: Number },
        { value: bucket.Payout, type: Number },
        { value: bucket.Refund, type: Number },
    ]);

    const date = new Date().toISOString().split("T")[0];

    await writeXlsxFile([HEADER_ROW, ...rows]).toFile(`transaction-report-${groupBy}-${date}.xlsx`);
}