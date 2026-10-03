import type { DisputeStatus } from "../../proposal/proposalInterface";
import type { JobStatus } from "../../user/jobs/jobInterface";
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




export interface IStatusStat{
  name: JobStatus,
  value:number
}

export interface JobReportDTO{
  data: IStatusStat[],
  totalValue:number
}

export interface IDisputeStat{
  name: DisputeStatus,
  value:number
}

export interface DisputeReportDTO{
  data: IDisputeStat[],
  totalValue:number
}





export interface AdminDashboardDTO {
    activeUsersCount: number,
    activeJobCount: number,
      totalRefund:number
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