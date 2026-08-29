import Logger from "../../config/logger";
import type { TransactionRepoDTO } from "../../DTO/common/transaction";
import type { paymentRepoDTO } from "../../DTO/proposal/payment";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponse } from "../../interfaces/base/IApiResponse";
import type { ITransactionRepository } from "../../interfaces/base/ITransaction";
import type { GateWayData, IPaymentGateway } from "../../interfaces/proposal/IPaymentGateway";
import type { IEscrow } from "../../interfaces/proposal/IProposal";
import type { IPaymentRepository, IProposalRepository } from "../../interfaces/proposal/IProposalRepository";
import type { IPaymentService } from "../../interfaces/proposal/IProposalService";
import { TRANSACTION_TYPE, USER_ROLES } from "../../shared/enums/commonEnums";
import { EscrowStatus, Payment_Status, ServicePaymentStatus, ServiceStatus } from "../../shared/enums/proposalEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";

export class PaymentService implements IPaymentService {
    constructor(protected _userRepo: IUserRepository, private _transactionRepo: ITransactionRepository, private _paymentGateway: IPaymentGateway, private _proposalRepo: IProposalRepository, private _paymentRepo: IPaymentRepository) { }

    async createPaymentIntent(jobId: string): Promise<IApiResponse<string>> {
        const proposal = await this._proposalRepo.getProposal(jobId)
        if (!proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const service = proposal.services.find(d => d.status === ServiceStatus.OPEN && d.paymentStatus === ServicePaymentStatus.PENDING)
        if (!service) {
            throw new AppError(PROPOSAL_MESSAGES.PAYMENT.NO_OPEN_SERVICE, RESPONSE_CODE.BAD_REQUEST)
        }
        const paymentGateWayData: GateWayData = {
            amount: service.price * 100,
            currency: "inr",
            metadata: {
                jobId: proposal.sourceId.toString(),
                proposalId: proposal.id,
                serviceName: service.serviceName,
                serviceOrder: service.order
            }
        }
        const intent = await this._paymentGateway.createPaymentIntent(paymentGateWayData)
        const paymentRepo: paymentRepoDTO = {
            jobId: proposal.sourceId.toString(),
            customerId: proposal.clientId.id,
            designerId: proposal.designerId.id,
            stripePaymentIntentId: intent.intentId,
            amount: service.price,
            serviceName: service.serviceName,
            serviceOrder: service.order
        }
        const admin = await this._userRepo.findByRole(USER_ROLES.ADMIN)
        if (!admin) {
            throw new AppError(AUTH_MESSAGES.AUTH.NOT_ADMIN, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const payment = await this._paymentRepo.createPayment(paymentRepo)
        const transactionData: TransactionRepoDTO = {
            amount: payment.amount,
            sourceUserId: payment.customerId.toString(),
            destinationUserId: admin.id,
            type: TRANSACTION_TYPE.PAYMENT
        }
        await this._transactionRepo.createTransaction(transactionData)
        return { message: PROPOSAL_MESSAGES.PAYMENT.CREATED, statuscode: RESPONSE_CODE.CREATED, data: intent.clientSecret }
    }

    async verifyPaymentIntent(paymentIntent: string): Promise<IApiResponse> {
        const exsistingPayment = await this._paymentRepo.findByIntentId(paymentIntent)
        if (exsistingPayment && exsistingPayment.status === Payment_Status.SUCCEEDED) {
            return { message: PROPOSAL_MESSAGES.PAYMENT.ALREADY_SUCCESS }
        }
        const intent = await this._paymentGateway.getPaymentIntent(paymentIntent)
        if (intent.status === Payment_Status.SUCCEEDED) {
            await this.markPaymentSucceeded(intent.paymentIntentId, intent.jobId, intent.serviceOrder)
        }
        return { message: PROPOSAL_MESSAGES.PAYMENT.MARKED_SUCCESS }
    }

    async markPaymentSucceeded(paymentIntentId: string, sourceId: string, order: number): Promise<void> {

        const payment = await this._paymentRepo.findByIntentId(paymentIntentId);

        if (payment && payment.status === Payment_Status.SUCCEEDED) {
            Logger.info(`Payment ${paymentIntentId} already marked as SUCCEEDED. Skipping.`);
            return;
        }
        const updatePaymentStatus = await this._paymentRepo.updateStatus(paymentIntentId, Payment_Status.SUCCEEDED)
        if (!updatePaymentStatus) {
            Logger.error(`Payment not found for intent: ${paymentIntentId}`)
            return
        }

        const proposal = await this._proposalRepo.getProposal(sourceId)
        if (!proposal) {
            Logger.error(`Proposal not found`)
            return
        }
        Logger.info(`${order} service order`)
        const service = proposal.services.find(e => e.order === order)
        if (!service) {
            Logger.error(`Service not found`)
            return
        }


        const serviceProportion = service.price / proposal.totalContractValue
        const servicePlatformFee = Math.round(proposal.platformFee * serviceProportion)
        const designerPayout = service.price - servicePlatformFee

        const escrowData: Partial<IEscrow> = {
            amountHeld: service.price,
            platformCommission: servicePlatformFee,
            designerPayout: designerPayout,
            status: EscrowStatus.HELD,
        }

        await this._proposalRepo.updateService(sourceId, order, ServiceStatus.IN_PROGRESS, escrowData)
    }


    async markPaymentFailed(paymentIntentId: string): Promise<void> {
        const updated = await this._paymentRepo.updateStatus(paymentIntentId, Payment_Status.FAILED)
        if (!updated) {
            Logger.error(`Payment not found for intent: ${paymentIntentId}`)
            return
        }


        await this._proposalRepo.updateService(
            updated.jobId.toString(),
            updated.serviceOrder,
            ServiceStatus.OPEN,
            {}
        )
    }
}