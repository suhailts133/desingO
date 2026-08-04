import type { CreateProposalDTO, ProposalAcceptOrRejectDTO, ProposalDetailDTO, ProposalInputData } from "../../DTO/proposal/proposal";
import type { ReviewListDTO, ReviewPayload, ReviewResponseDTO } from "../../DTO/proposal/review";
import type {  VersionAcceptOrRejectDTO } from "../../DTO/proposal/version";
import type { IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse";

export interface IProposalService {
    createProposal(data: CreateProposalDTO): Promise<IApiResponse>
    getProposal(sourceId: string): Promise<IApiResponse<ProposalDetailDTO | null>>
    getProposalInputForJobRequest(id: string): Promise<IApiResponse<ProposalInputData>>
    getProposalTemplateForDirecHire(id: string): Promise<IApiResponse<ProposalInputData>>
    approveOrRejectProposal(data: ProposalAcceptOrRejectDTO): Promise<IApiResponse<"Accepted" | "Rejected">>
}
export interface IReviewService {
    createReview(userId: string, data: ReviewPayload): Promise<IApiResponse<ReviewResponseDTO>>
    getMyReviews(designerId: string, page?: string): Promise<IApiResponseWithPagination<ReviewListDTO[]>>
}


export interface IProposalVersionService {
    uploadProposalImage(sourceId: string, ServiceNumber: number, serviceImages: Express.Multer.File[]): Promise<IApiResponse>;
    acceptOrRejectVersion(data: VersionAcceptOrRejectDTO): Promise<IApiResponse>;
}

export interface IPaymentService {
    createPaymentIntent(jobId: string): Promise<IApiResponse<string>>
    markPaymentSucceeded(paymentIntentId: string, sourceId: string, order: number): Promise<void>;
    markPaymentFailed(paymentIntentId: string): Promise<void>;

}