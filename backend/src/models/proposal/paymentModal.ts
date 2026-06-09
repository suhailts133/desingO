import mongoose, {  Schema } from 'mongoose';
import type { IPayment } from '../../interfaces/proposal/IPayment.js';

const PaymentSchema = new Schema<IPayment>(
    {
        jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
        customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        designerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        stripePaymentIntentId: { type: String, required: true, unique: true },
        serviceName: { type: String, required: true },
        serviceOrder: { type: Number, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: 'inr' },
        status: { type: String, enum: ['pending', 'succeeded', 'failed', 'refunded'], default: 'pending' },
    },
    { timestamps: true }
);

export const PaymentModel = mongoose.model<IPayment>('Payment', PaymentSchema);