import Logger from "../../config/logger.js";
import type { paymentRepoDTO } from "../../DTO/proposal/payment.js";
import type { IApiResponse } from "../../interfaces/base/IApiResponse.js";
import type { GateWayData, IPaymentGateway } from "../../interfaces/proposal/IPaymentGateway.js";
import type { IEscrow } from "../../interfaces/proposal/IProposal.js";
import type { IPaymentRepository, IProposalRepository } from "../../interfaces/proposal/IProposalRepository.js";
import type { IPaymentService } from "../../interfaces/proposal/IProposalService.js";
import { EscrowStatus, Payment_Status, ServicePaymentStatus, ServiceStatus } from "../../shared/enums/proposalEnums.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { AppError } from "../../shared/errors/appError.js";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages.js";

export class PaymentService implements IPaymentService {
    constructor(private _paymentGateway: IPaymentGateway, private _proposalRepo: IProposalRepository, private _paymentRepo: IPaymentRepository) { }

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
        await this._paymentRepo.createPayment(paymentRepo)
        return { message: PROPOSAL_MESSAGES.PAYMENT.CREATED, statuscode: RESPONSE_CODE.CREATED, data: intent.clientSecret }
    }

    async markPaymentSucceeded(paymentIntentId: string, sourceId: string, order: number): Promise<void> {
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