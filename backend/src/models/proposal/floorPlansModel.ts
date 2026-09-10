import { Schema, model } from "mongoose";
import { imageFormatSchema } from "./schemas/imageFormatSchema";
import type { IFloorPlan } from "../../interfaces/proposal/IFloorPlan";

export const floorPlansSchema = new Schema<IFloorPlan>({
    version: { type: Number, required: true },
    proposalId: { type: Schema.Types.ObjectId, ref: "Proposal", required: true, index: true },
    plans: { type: imageFormatSchema, required: true },
    rejectionReason: { type: String },
    status: { type: String, enum: ["Approved", "Rejected", "Pending"], default: "Pending" }
}, { timestamps: true })



export const FloorPlanModel = model<IFloorPlan>("FloorPlan", floorPlansSchema);