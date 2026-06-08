import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { CreateProposalRepoDataDTO, GetProposalDTO } from "../../DTO/proposal/proposal.js";
import type { ReviewRepoDTO } from "../../DTO/proposal/review.js";
import type { ContractStatus, IProposal, IReview, ServiceStatus } from "./IProposal.js";

export interface IProposalRepository {
    createProposal(data: CreateProposalRepoDataDTO): Promise<IProposal>
    getProposal(sourceId: string): Promise<GetProposalDTO | null>
    acceptOrRejectProposal(sourceId: string,  contractStatus: ContractStatus, overallRejectionReason?: string): Promise<IProposal | null>
    updateServiceStatus(sourceId: string, order: number, status: ServiceStatus): Promise<IProposal | null>
}

export interface IReviewRepository {
    createReview(data: ReviewRepoDTO): Promise<IReview>
    alreadyExsits(jobId: string, userId: string): Promise<IReview | null>
    getMyReviews(designerId: string, page?: string): Promise<{ data: IReview[], pagination: Pagination }>
}