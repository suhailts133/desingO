import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { paymentRepoDTO } from "../../DTO/proposal/payment.js";
import type { CreateProposalRepoDataDTO, GetProposalDTO } from "../../DTO/proposal/proposal.js";
import type { ReviewRepoDTO } from "../../DTO/proposal/review.js";
import type { IPayment, PaymentStatus } from "./IPayment.js";
import type { ContractStatus, IEscrow, IProposal, IReview, ServiceStatus } from "./IProposal.js";

export interface IProposalRepository {
    createProposal(data: CreateProposalRepoDataDTO): Promise<IProposal>
    getProposal(sourceId: string): Promise<GetProposalDTO | null>
    acceptOrRejectProposal(sourceId: string, contractStatus: ContractStatus, overallRejectionReason?: string): Promise<IProposal | null>
    updateService(sourceId: string, order: number, status: ServiceStatus, escrow: Partial<IEscrow>): Promise<IProposal | null>

}

export interface IReviewRepository {
    createReview(data: ReviewRepoDTO): Promise<IReview>
    alreadyExsits(jobId: string, userId: string): Promise<IReview | null>
    getMyReviews(designerId: string, page?: string): Promise<{ data: IReview[], pagination: Pagination }>
}

export interface IPaymentRepository {
    createPayment(data: paymentRepoDTO): Promise<IPayment>
    findByIntentId(stripePaymentIntentId: string): Promise<IPayment | null>
    findByJobId(jobId: string): Promise<IPayment[]>
    updateStatus(stripePaymentIntentId: string, status: PaymentStatus): Promise<IPayment | null>
}