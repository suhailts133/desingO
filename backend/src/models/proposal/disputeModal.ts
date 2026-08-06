import mongoose, { Schema } from "mongoose";
import { imageFormatSchema } from "./schemas/imageFormatSchema";
import type { IDispute } from "../../interfaces/proposal/IDispute";

export const disputeSchema = new Schema<IDispute>({
    proposalId: { type: Schema.Types.ObjectId, ref: "Proposal", required: true },
    raisedBy: { type: String, enum: ["Customer", "Designer"], required: true },
    serviceOrder: { type: Number, required: true },
    reason: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    evidence: { type: [imageFormatSchema], default: [] },
    status: { type: String, enum: ["Open", "Under Review", "Resolved", "Redo", "Awaiting Confirmation"], default: "Open", required: true },
    resolution: { type: String },
    resolutionType: { type: String },
    refundAmount: { type: Number },
    resolvedAt: { type: Date },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    designerId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

export const DisputeModel = mongoose.model<IDispute>("Dispute", disputeSchema);