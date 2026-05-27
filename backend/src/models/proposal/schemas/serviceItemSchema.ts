import { Schema } from "mongoose"
import type { IServiceItem } from "../../../interfaces/proposal/IProposal.js"
import { imageFormatSchema } from "./imageFormatSchema.js"
import { escrowSchema } from "./escrowSchema.js"


export const serviceItemSchema = new Schema<IServiceItem>({
    serviceName: { type: String, required: true },
    order: { type: Number, required: true },
    price: { type: Number, required: true },
    executionPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Locked", "Open", "In Progress", "Uploaded", "Redo", "Completed"],
        default: "Locked",

    },
    rejectionReason: { type: String },
    uploadedImages: { type: [imageFormatSchema], default: [] },
    currentVersion: { type: Number, default: 0 },
    revisionLimit: { type: Number, default: 5 },
    revisionsUsed: { type: Number, default: 0 },
    expectedDeliveryDate: { type: Date, required: true },
    actualDeliveryDate: { type: Date },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Refunded"],
        default: "Pending",
    },
    stripePaymentIntentId: { type: String },
    paidAt: { type: Date },
    escrow: { type: escrowSchema },

}, { _id: false })