import mongoose, { Schema } from "mongoose";
import type { IJobRequest, IRoomMeasurement } from "../../interfaces/customer/ICustomer.js";
import type { ImageUploadResult } from "../../interfaces/base/IImageUpload.js";


const imageFormatSchema = new Schema<ImageUploadResult>({
    path: { type: String, required: true },
    filename: { type: String, required: true },
}, { _id: false })


const roomSchema = new Schema<IRoomMeasurement>({
    spaceType: { type: String, required: true },
    length: { type: String, required: true },
    width: { type: String, required: true },
    unit: { type: String, required: true },
    ceilingHeight: { type: String },
    notes: { type: String }
}, { _id: false })


const jobequestSchema = new Schema<IJobRequest>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    projectTitle: { type: String, required: true },
    propertyType: { type: String, required: true },
    description: { type: String, required: true },
    designStyles: { type: [String], required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    phone: { type: String, required: true },
    timeline: { type: String, required: true },
    minBudget: { type: Number, required: true },
    maxBudget: { type: Number, required: true },
    rooms: { type: [roomSchema], required: true },
    services: { type: [String], required: true, default: [] },
    referenceImages: { type: [imageFormatSchema], required: true, default: [] },
    status: { type: String, enum: ["Pending", "Closed", "Ongoing"], default: "Pending" },

}, { timestamps: true })


export const JobRequestModel = mongoose.model<IJobRequest>("JobRequest", jobequestSchema)