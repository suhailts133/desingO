import type mongoose from "mongoose";
import type { AggregatedBucketRaw, AllTransactionDTO, ReportFilters, ReportResponseDto, TransactionFilter, TransactionPopulated, TransactionRepoDTO } from "../../DTO/common/transaction";
import type { Pagination } from "../../DTO/admin/adminDTO";
import type { IApiResponse, IApiResponseWithPagination } from "./IApiResponse";

export type TransactionType = "Payment" | "Commission" | "Payout" | "Refund";


export interface ITransaction {
    id: string;
    amount: number;
    type: TransactionType;
    sourceUserId: mongoose.Types.ObjectId;
    destinationUserId?: mongoose.Types.ObjectId;
    proposalId?: mongoose.Types.ObjectId;
    disputeId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITransactionRepository {
    createTransaction(data: TransactionRepoDTO): Promise<ITransaction>
    getAllTransaction(filter?: TransactionFilter): Promise<{ data: TransactionPopulated[]; pagination: Pagination; }>
    getTransactionReport(filters: ReportFilters): Promise<AggregatedBucketRaw[]>
}

export interface ITransactionService {
    getAllTransaction(filter?: TransactionFilter): Promise<IApiResponseWithPagination<AllTransactionDTO[]>>
    generateReport(filters:ReportFilters):Promise<IApiResponse<ReportResponseDto>>
}