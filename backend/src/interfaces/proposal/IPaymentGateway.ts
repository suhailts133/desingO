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
}

export interface IPaymentWebhookService {
    handleWebhook(rawBody: Buffer, signature: string): Promise<{ received: boolean }>
}