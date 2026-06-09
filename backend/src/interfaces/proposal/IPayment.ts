import mongoose from 'mongoose';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface IPayment {
    jobId: mongoose.Types.ObjectId;
    customerId: mongoose.Types.ObjectId;
    designerId: mongoose.Types.ObjectId;
    stripePaymentIntentId: string;
    serviceName: string,
    serviceOrder: number,
    amount: number;
    currency: string;
    status: PaymentStatus;
    createdAt: Date;
}

