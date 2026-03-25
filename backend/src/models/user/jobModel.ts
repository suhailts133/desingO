import mongoose, { Schema } from "mongoose";
import type { IJobRequest, IRoomMeasurement } from "../../interfaces/customer/ICustomer.js";

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
    budget: { type: String, required: true },
    rooms: { type: [roomSchema], required: true },
    status: { type: String, enum: ["Pending", "Closed", "Ongoing"], default: "Pending" },

}, { timestamps: true })


export const JobRequestModel = mongoose.model<IJobRequest>("JobRequest", jobequestSchema)