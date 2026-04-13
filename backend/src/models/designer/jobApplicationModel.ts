import mongoose, { Schema } from "mongoose"
import type { IJobApplication } from "../../interfaces/designer/IDesigner.js"


const jobApplicationSchema = new Schema<IJobApplication>({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    designerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobRequest",
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Rejected", "Ongoing"],
        required: true,
        default: "Pending"
    },
    rejectionReason: {
        type: String
    }

}, { timestamps: true })

export const JobApplicationModel = mongoose.model<IJobApplication>("JobApplication", jobApplicationSchema)