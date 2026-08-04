import type Stripe from "stripe";
import type { IPaymentService } from "../../interfaces/proposal/IProposalService";
import Logger from "../../config/logger";
import type { IPaymentWebhookService } from "../../interfaces/proposal/IPaymentGateway";

export class PaymentWebhookService implements IPaymentWebhookService {
    constructor(private _stripe: Stripe, private _paymentService: IPaymentService) { }

    async handleWebhook(rawBody: Buffer, signature: string) {
        const event = this._stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );

        switch (event.type) {
            case "payment_intent.succeeded": {
                const intent = event.data.object as Stripe.PaymentIntent;
                const { jobId, serviceOrder } = intent.metadata;

                try {
                    await this._paymentService.markPaymentSucceeded(
                        intent.id,
                        jobId as string,
                        Number(serviceOrder)
                    );
                } catch (err) {
                    Logger.error(`Failed to handle payment_intent.succeeded: ${intent.id}`, err);
                    throw err;
                }

                break;
            }

            case "payment_intent.payment_failed": {
                const intent = event.data.object as Stripe.PaymentIntent;

                try {
                    await this._paymentService.markPaymentFailed(intent.id);
                } catch (err) {
                    Logger.error(`Failed to handle payment_intent.payment_failed: ${intent.id}`, err);
                    throw err;
                }

                break;
            }
        }

        return { received: true };
    }
}