import mongoose, { Schema } from "mongoose"
import type { IDesigner, IWorkExperience, IEducation } from "../../interfaces/designer/IDesigner"
import type { ImageUploadResult } from "../../interfaces/base/IImageUpload"

const imageFormatSchema = new Schema<ImageUploadResult>({
    path: { type: String, required: true },
    filename: { type: String, required: true },
}, { _id: false })

const workExperienceSchema = new Schema<IWorkExperience>({
    companyName: { type: String, required: true },
    yearsOfExperience: { type: String, required: true },
    role: { type: String, required: true },
    proof: { type: imageFormatSchema, required: true }
}, { _id: false })

const educationSchema = new Schema<IEducation>({
    courseName: { type: String, required: true },
    institutionName: { type: String, required: true },
    completionYear: { type: String, required: true },
    certification: { type: imageFormatSchema, required: true }
}, { _id: false })

const designerSchema = new Schema<IDesigner>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    phone: { type: String },
    attempt: { type: Number, default: 1 },
    state: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    portfolioUrl: { type: String, required: true },
    bio: { type: String, required: true },
    governmentIdType: {
        type: String,
        enum: ["aadhar_card", "driving_licence"],
        required: true,
    },
    govtIdImage: { type: imageFormatSchema, required: true },
    workExperience: { type: [workExperienceSchema], required: false, default: [] },
    education: { type: [educationSchema], required: true },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        required: true,
        default: "Pending"
    },
    rejectionReason: { type: String }
}, { timestamps: true })

export const DesignerModel = mongoose.model<IDesigner>("Designer", designerSchema)