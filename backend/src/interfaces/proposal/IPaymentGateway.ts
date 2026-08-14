import type { PaymentIntentDTO } from "../../DTO/proposal/payment";

export interface GateWayData {
    amount: number;
    currency: string;
    metadata: {
        jobId: string,
        proposalId: string,
        serviceOrder: number
        serviceName: string
    };
}


export interface IPaymentGateway {
    createPaymentIntent(data: GateWayData): Promise<{ intentId: string, clientSecret: string }>;
    getPaymentIntent(intentId: string): Promise<PaymentIntentDTO>;
}

export interface IPaymentWebhookService {
    handleWebhook(rawBody: Buffer, signature: string): Promise<{ received: boolean }>
}