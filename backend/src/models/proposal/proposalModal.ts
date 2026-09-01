import mongoose, { Schema } from "mongoose"
import type { IProposal } from "../../interfaces/proposal/IProposal"
import { serviceItemSchema } from "./schemas/serviceItemSchema"
import { imageFormatSchema } from "./schemas/imageFormatSchema"

const proposalSchema = new Schema<IProposal>({

    sourceId: { type: mongoose.Schema.Types.ObjectId, ref: "JobRequest", required: true },
    activeJobId: { type: mongoose.Schema.Types.ObjectId, ref: "ActiveJob", required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    designerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    disputeId: { type: String },
    disputeCount: { type: Number, default: 0 },
    floorPlan: { type: [imageFormatSchema], default: [] },
    totalArea: { type: Number, required: true },
    unit: { type: String, enum: ["ft", "m"], required: true },
    drawingFeePerSqFt: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    remainingPlatformFee: { type: Number, required: true },
    currentAmountHeld: { type: Number, required: true },
    totalDrawingFee: { type: Number, required: true },
    services: { type: [serviceItemSchema], required: true, default: [] },
    totalContractValue: { type: Number, required: true },
    totalExecutionFee: { type: Number, required: true },
    contractStatus: {
        type: String,
        enum: ["Sent", "Accepted", "Rejected", "Ongoing", "Completed", "Disputed", "Expired"],
        default: "Sent",
        required: true
    },
    sourceType: { type: String, enum: ['jobRequest', 'direct_hire'], required: true },
    overallRejectionReason: { type: String },
    sourceName: { type: String, required: true },
    siteVisitingNeeded: { type: Boolean, default: false },
    expectedSiteVisitingDate: { type: Date },
    clientAcceptedAt: { type: Date },
    expectedCompletionDate: { type: Date, required: true },
    actualCompletionDate: { type: Date },
}, { timestamps: true })

export const ProposalModel = mongoose.model<IProposal>("Proposal", proposalSchema)