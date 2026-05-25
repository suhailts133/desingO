// models/proposal/proposalModel.ts
import mongoose, { Schema } from "mongoose"
import type { IProposal } from "../../interfaces/proposal/IProposal.js"
import { serviceItemSchema } from "./schemas/serviceItemSchema.js"

const proposalSchema = new Schema<IProposal>({
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sourceType: {
        type: String,
        enum: ["jobRequest", "directHire"],
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    designerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    drawingFeePerSqFt: { type: Number, required: true },
    totalDrawingFee: { type: Number, required: true },
    services: { type: [serviceItemSchema], required: true, default: [] },
    totalContractValue: { type: Number, required: true },
    totalExecutionFee: { type: Number, required: true },
    advanceFee: { type: Number, required: true },
    advancePaid: { type: Boolean, default: false },
    advancePaidAt: { type: Date },
    advanceStripePaymentIntentId: { type: String },
    contractStatus: {
        type: String,
        enum: ["Sent", "Accepted", "Rejected", "Ongoing", "Completed", "Disputed", "Expired"],
        default: "Sent",
        required: true
    },
    overallRejectionReason: { type: String },
    clientAcceptedAt: { type: Date },
    designerAcceptedAt: { type: Date },
    expectedCompletionDate: { type: Date, required: true },
    actualCompletionDate: { type: Date },
}, { timestamps: true })

export const ProposalModel = mongoose.model<IProposal>("Proposal", proposalSchema)