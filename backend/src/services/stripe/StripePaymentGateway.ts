import Stripe from "stripe";
import type { GateWayData, IPaymentGateway } from "../../interfaces/proposal/IPaymentGateway.js";
import { AppError } from "../../shared/errors/appError.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages.js";

export class StripePaymentGateway implements IPaymentGateway {
    constructor(private readonly _stripe: Stripe) { }

    async createPaymentIntent(data: GateWayData): Promise<{ intentId: string; clientSecret: string }> {
        const intent = await this._stripe.paymentIntents.create({
            amount: data.amount,
            currency: data.currency,
            metadata: {
                jobId: data.metadata.jobId,
                proposalId: data.metadata.proposalId,
                serviceOrder: data.metadata.serviceOrder.toString(),
                serviceName: data.metadata.serviceName,
            },
        });

        if (!intent.client_secret) {
            throw new AppError(PROPOSAL_MESSAGES.PAYMENT.INTENT_NOT_CREATED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }

        return {
            intentId: intent.id,
            clientSecret: intent.client_secret,
        }
    }
}