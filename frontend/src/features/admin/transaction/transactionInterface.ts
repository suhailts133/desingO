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
