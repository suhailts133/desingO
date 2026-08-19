import mongoose, { Schema } from "mongoose";
import type { IHouseholdProfile, IJobRequest, INewBuildDetails, IRenovationDetails } from "../../interfaces/customer/ICustomer";
import type { ImageUploadResult } from "../../interfaces/base/IImageUpload";


const imageFormatSchema = new Schema<ImageUploadResult>({
    path: { type: String, required: true },
    filename: { type: String, required: true },
}, { _id: false })



const householdProfileSchema = new Schema<IHouseholdProfile>({
    adultsCount: { type: Number, default: 1, min: 0 },
    kidsCount: { type: Number, default: 0, min: 0 },
    seniorsCount: { type: Number, default: 0, min: 0 },
    hasPets: { type: Boolean, default: false },
    petDetails: { type: String },
}, { _id: false });

const renovationDetailsSchema = new Schema<IRenovationDetails>({
    level: { type: String, enum: ["DECOR_ONLY", "ROOMS_UPGRADE", "COMPLETE_MAKEOVER"], required: true, },
    propertyAgeYears: { type: String },
    livingInDuringRenovation: { type: Boolean, default: false },
}, { _id: false });

const newBuildDetailsSchema = new Schema<INewBuildDetails>({
    stage: { type: String, enum: ["PLANNING", "UNDER_CONSTRUCTION", "BARE_SHELL_READY"], required: true, },
    vastuCompliantRequired: { type: Boolean, default: false },
}, { _id: false });


const jobRequestSchema = new Schema<IJobRequest>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    designerId: { type: Schema.Types.ObjectId, ref: "User" },
    designId: { type: Schema.Types.ObjectId, ref: "Design" },
    projectTitle: { type: String, required: true, trim: true },
    propertyType: { type: String, required: true },
    projectType: { type: String, enum: ["Renovation", "New_Build"], required: true },
    sourceType: { type: String, enum: ["JOB_REQUEST", "DIRECT_HIRE"], required: true },


    city: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },


    totalCarpetArea: { type: Number, required: true, min: 0 },
    areaUnit: { type: String, enum: ["ft", "m"], default: "ft" },
    selectedRooms: { type: [String], required: true, default: [] },

    floorPlans: { type: [imageFormatSchema], default: [] },
    requiresSiteVisitMeasurement: { type: Boolean, default: false },


    renovationDetails: { type: renovationDetailsSchema },
    newbuildDetails: { type: newBuildDetailsSchema },


    designStyles: { type: [String], required: true, default: [] },
    preferredMaterials: { type: [String], default: [] },
    householdProfile: { type: householdProfileSchema, required: true },


    services: { type: [String], required: true, default: [] },
    minBudget: { type: Number, required: true, min: 0 },
    maxBudget: { type: Number, required: true, min: 0 },
    timeline: { type: String, required: true },
    rejectionReason: { type: String },

    description: { type: String, required: true },
    referenceImages: { type: [imageFormatSchema], default: [] },

    status: { type: String, enum: ["Pending", "Accepted", "Ongoing", "Closed", "Rejected"], default: "Pending" },
},
    { timestamps: true }
);
export const JobRequestModel = mongoose.model<IJobRequest>("JobRequest", jobRequestSchema)