import mongoose, { Schema } from "mongoose"
import type { IServiceVersion } from "../../interfaces/proposal/IProposal.js"
import { imageFormatSchema } from "./schemas/imageFormatSchema.js"

export const serviceVersionSchema = new Schema<IServiceVersion>({
    proposalId: {
        type: Schema.Types.ObjectId,
        ref: "Proposal",
        required: true
    },
    serviceOrder: { type: Number, required: true },
    version: { type: Number, required: true },
    images: { type: [imageFormatSchema], default: [] },
    status: {
        type: String,
        enum: ["Pending_Review", "Rejected", "Approved"],
        default: "Pending_Review",
        required: true
    },
    rejectionReason: { type: String },
    uploadedAt: { type: Date, required: true },
}, { timestamps: true })

export const ServiceVersionModel = mongoose.model<IServiceVersion>("ServiceVersion", serviceVersionSchema)