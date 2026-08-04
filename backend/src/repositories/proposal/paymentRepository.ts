import mongoose from "mongoose";
import type { paymentRepoDTO } from "../../DTO/proposal/payment";
import type { IPayment, PaymentStatus } from "../../interfaces/proposal/IPayment";
import type { IPaymentRepository } from "../../interfaces/proposal/IProposalRepository";
import { PaymentModel } from "../../models/proposal/paymentModal";
import { BaseRepository } from "../baseRepository";

export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
    constructor() {
        super(PaymentModel)
    }

    async createPayment(data: paymentRepoDTO): Promise<IPayment> {
        return this.create({
            ...data,
            jobId:new mongoose.Types.ObjectId(data.jobId),
            designerId:new mongoose.Types.ObjectId(data.designerId),
            customerId:new mongoose.Types.ObjectId(data.customerId),
        });
    }

    async findByIntentId(stripePaymentIntentId: string): Promise<IPayment | null> {
        return this.findOne({ stripePaymentIntentId })
    }

    async findByJobId(jobId: string): Promise<IPayment[]> {
        return this.find({ jobId });
    }

    async updateStatus(stripePaymentIntentId: string, status: PaymentStatus): Promise<IPayment | null> {
        return this.updateOne({ stripePaymentIntentId }, { $set: { status } })
    }
}