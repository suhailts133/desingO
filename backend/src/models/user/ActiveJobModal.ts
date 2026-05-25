import mongoose, { Schema, } from "mongoose";
import type { IActiveJob, } from "../../interfaces/customer/ICustomer.js";




const activeJobSchema = new Schema<IActiveJob>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        designerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sourceType: {
            type: String,
            enum: ['jobRequest', 'direct_hire'],
            required: true
        },
        sourceId: { type: mongoose.Schema.Types.ObjectId },
        sourceName: { type: String, required: true },
        status: {
            type: String,
            enum: ["Active", "Completed", "Cancelled"],
            required: true,
            default: "Active"
        },
        startedAt: { type: Date, default: Date.now },
        cancelledAt: { type: Date },
        completedAt: { type: Date }
    },
    { timestamps: true }
);

export const ActiveJobModel = mongoose.model<IActiveJob>(
    "ActiveJob",
    activeJobSchema
);
