export interface TransactionFilter {
    type?: TransactionType;
    page?: string
}
export interface AllTransactionDTO {
    id: string;
    amount: number;
    type: TransactionType;
}
export type TransactionType = "Payment" | "Commission" | "Payout" | "Refund" | "All";
