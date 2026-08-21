import type { CreateProposalDTO, ProposalAcceptOrRejectDTO, ProposalDetailDTO, ProposalInputData, UpdateProposalDTO } from "../../DTO/proposal/proposal";
import type { ReviewListDTO, ReviewPayload, ReviewResponseDTO } from "../../DTO/proposal/review";
import type {  VersionAcceptOrRejectDTO } from "../../DTO/proposal/version";
import type { IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse";

export interface IProposalService {
    createProposal(data: CreateProposalDTO): Promise<IApiResponse>
    updateProposal(data: UpdateProposalDTO): Promise<IApiResponse>
    getProposal(sourceId: string): Promise<IApiResponse<ProposalDetailDTO | null>>
    getProposalTemplate(id: string): Promise<IApiResponse<ProposalInputData>>
    approveOrRejectProposal(data: ProposalAcceptOrRejectDTO): Promise<IApiResponse<"Accepted" | "Rejected">>
    uploadFloorPlan(proposalId: string, floorPlans: Express.Multer.File[]): Promise<IApiResponse>;
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
    verifyPaymentIntent(paymentIntent: string): Promise<IApiResponse>
    markPaymentSucceeded(paymentIntentId: string, sourceId: string, order: number): Promise<void>;
    markPaymentFailed(paymentIntentId: string): Promise<void>;

}