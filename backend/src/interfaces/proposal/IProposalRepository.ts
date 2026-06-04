import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { CreateProposalRepoDataDTO } from "../../DTO/proposal/proposal.js";
import type { ReviewRepoDTO } from "../../DTO/proposal/review.js";
import type { IProposal, IReview } from "./IProposal.js";

export interface IProposalRepository {
    createProposal(data: CreateProposalRepoDataDTO): Promise<IProposal>
    getProposal(sourceId: string): Promise<IProposal | null>
    updateProposal(sourceId: string, data: Partial<IProposal>): Promise<IProposal | null>
}

export interface IReviewRepository {
    createReview(data: ReviewRepoDTO): Promise<IReview>
    alreadyExsits(jobId:string, userId:string): Promise<IReview | null>
    getMyReviews(designerId: string, page?: string): Promise<{ data: IReview[], pagination: Pagination }>
}