import type { Tone } from "../../../shared/table/StatusBadge";
import type { ColumnDef } from "../../../shared/table/TableHeader";

export interface TransactionFilter {
    type?: TransactionType;
    page?: string
}
export interface AllTransactionDTO {
    id: string;
    amount: number;
    type: TransactionType;
    sourceName: string
    sourceRole: string
    sourceId: string
    designationName: string
    destinationRole: string
    destinationId: string
}
export type TransactionType = "Payment" | "Commission" | "Payout" | "Refund" | "All";


export const transactionColumns: ColumnDef<AllTransactionDTO>[] = [
    { key: "sourceName", label: "Sender" },
    { key: "sourceRole", label: "Sender Role" },
    { key: "designationName", label: "Recipient" },
    { key: "destinationRole", label: "Recipient Role" },
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount", className: "font-Jost-Semibold text-soft-black text-sm" },
];

export const transactionTypeTone: Record<Exclude<AllTransactionDTO["type"], "All">, Tone> = {
    Payment: "info",
    Commission: "warning",
    Payout: "success",
    Refund: "error",
};

