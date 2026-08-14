export interface paymentRepoDTO {
    jobId: string
    customerId: string
    designerId: string
    stripePaymentIntentId: string;
    serviceName: string,
    serviceOrder: number,
    amount: number;
}


export interface PaymentIntentDTO {
    paymentIntentId: string,
    status: string,
    jobId: string,
    serviceOrder: number
}