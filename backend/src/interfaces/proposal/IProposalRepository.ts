import type { Pagination } from "../../DTO/admin/adminDTO";
import type { paymentRepoDTO } from "../../DTO/proposal/payment";
import type { CreateProposalRepoDataDTO, GetProposalDTO } from "../../DTO/proposal/proposal";
import type { ReviewRepoDTO } from "../../DTO/proposal/review";
import type { CreateServiceVersionRepoDTO, VersionAcceptOrRejectDTO } from "../../DTO/proposal/version";
import type { IPayment, PaymentStatus } from "./IPayment";
import type { ContractStatus, IEscrow, IProposal, IReview, IServiceVersion, ProposalServiceStatus } from "./IProposal";

export interface IProposalRepository {
    createProposal(data: CreateProposalRepoDataDTO): Promise<IProposal>
    getProposal(sourceId: string): Promise<GetProposalDTO | null>
    updateProposal(proposalId:string, data:Partial<IProposal>):Promise<IProposal | null>
    acceptOrRejectProposal(sourceId: string, contractStatus: ContractStatus, overallRejectionReason?: string): Promise<IProposal | null>
    updateService(sourceId: string, order: number, status: ProposalServiceStatus, escrow: Partial<IEscrow>): Promise<IProposal | null>
    updateServiceVersion(sourceId: string, order: number, status: ProposalServiceStatus, newVersion: number): Promise<IProposal | null>
    acceptOrRejectServiceResult(sourceId: string, order: number, status: ProposalServiceStatus): Promise<IProposal | null>
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


export interface IServiceVersionRepository {
    acceptOrRejectVersion(data: VersionAcceptOrRejectDTO): Promise<IServiceVersion | null>
    createVersion(data: CreateServiceVersionRepoDTO): Promise<IServiceVersion>
    findVersion(versionId: string): Promise<IServiceVersion | null>
    findAllVersions(sourceId: string): Promise<IServiceVersion[]>

}