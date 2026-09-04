import type { IUser } from "../../interfaces/auth/IUser";
import type { ITransaction, TransactionType } from "../../interfaces/base/ITransaction";

export interface TransactionRepoDTO {
  amount: number;
  type: TransactionType;
  sourceUserId: string;
  destinationUserId?: string;
  proposalId?: string;
  disputeId?: string;
  paymentReference?: string;
}

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

export type TransactionPopulated = Omit<ITransaction, "sourceUserId" | "destinationUserId"> & {
  sourceUserId: IUser;
  destinationUserId: IUser;
};

export type ReportGroupBy = "day" | "week" | "month" | "year" | "custom";

export interface ReportQueryParams {
  groupBy: string;
  from?: string;
  to?: string;
  type?: string;
}

export interface ReportFilters {
  groupBy: ReportGroupBy;
  from: string;
  to: string;
  type?: TransactionType;
}

export interface AggregatedBucketRaw {
  _id: { period: string; type: TransactionType };
  totalAmount: number;
  count: number;
}


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


export const DATE_FORMAT_BY_GROUP: Record<Exclude<ReportGroupBy, "custom">, string> = {
  day: "%Y-%m-%d",
  week: "%G-W%V",
  month: "%Y-%m",
  year: "%Y",
};


export const DEFAULT_RANGE_DAYS: Record<Exclude<ReportGroupBy, "custom">, number> = {
  day: 30,
  week: 90,
  month: 365,
  year: 365 * 5,
};



export const VALID_GROUP_BY: ReportGroupBy[] = ["day", "week", "month", "year", "custom"];
export const VALID_TYPES: TransactionType[] = ["Payment", "Commission", "Payout", "Refund"];

