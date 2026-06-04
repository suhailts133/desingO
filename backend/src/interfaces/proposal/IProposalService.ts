import type { CreateProposalDTO, ProposalAcceptOrRejectDTO, ProposalDetailDTO, ProposalInputData } from "../../DTO/proposal/proposal.js";
import type { ReviewListDTO, ReviewPayload, ReviewResponseDTO } from "../../DTO/proposal/review.js";
import type { IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse.js";

export interface IProposalService {
    createProposal(data: CreateProposalDTO): Promise<IApiResponse>
    getProposal(sourceId: string): Promise<IApiResponse<ProposalDetailDTO | null>>
    getProposalInputForJobRequest(id: string): Promise<IApiResponse<ProposalInputData>>
    getProposalTemplateForDirecHire(id: string): Promise<IApiResponse<ProposalInputData>>
    approveOrRejectProposal(data: ProposalAcceptOrRejectDTO): Promise<IApiResponse<"Accepted"|"Rejected">>
}
export interface IReviewService {
    createReview(userId:string, data: ReviewPayload): Promise<IApiResponse<ReviewResponseDTO>>
    getMyReviews(designerId:string, page?:string): Promise<IApiResponseWithPagination<ReviewListDTO[]>>
}