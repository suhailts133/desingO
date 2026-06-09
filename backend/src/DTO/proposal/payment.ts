export interface paymentRepoDTO {
    jobId: string
    customerId: string
    designerId: string
    stripePaymentIntentId: string;
    serviceName: string,
    serviceOrder: number,
    amount: number;
}