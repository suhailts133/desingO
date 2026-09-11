import type { TransactionType } from "../transaction/transactionInterface";

export interface ReportBucketDto {
    period: string;
    total: number;
    count: number;
    Payment: number;
    Commission: number;
    Payout: number;
    Refund: number;
}

export interface ReportResponseDto {
    groupBy: ReportGroupBy;
    from: string;
    to: string;
    data: ReportBucketDto[];
    summary: {
        total: number;
        byType: Record<TransactionType, number>;
    };
}
export interface ReportQueryParams {
    groupBy: string;
    from?: string;
    to?: string;
    type?: string;
}

export type ReportGroupBy = "day" | "week" | "month" | "year" | "custom";





export interface AdminDashboardDTO {
    activeUsersCount: number,
    activeJobCount: number,
    totalCommision: number
    disputes: AdminOngoingDisputeDTOs[]
    designerVerificationRequests: PendingVerificationRequests[]
}

export type PendingStatusType = "Pending"

export interface PendingVerificationRequests {
    id: string
    email: string
    name: string
    status: PendingStatusType
}
export interface AdminOngoingDisputeDTOs {
    id: string
    type: string
    reason: string
    status: "Open" | "Redo"
}