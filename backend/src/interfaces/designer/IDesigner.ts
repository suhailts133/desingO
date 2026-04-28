import mongoose from "mongoose";
import type { ImageUploadResult } from "../base/IImageUpload.js";


export interface DesignerVerificationFiles {
    governmentIdImageFile: Express.Multer.File
    educationImagesFiles: Express.Multer.File[]
    workExperienceImageFiles?: Express.Multer.File[]
}

export interface IEducation {
    institutionName: string;
    courseName: string;
    completionYear: string;
    certification: ImageUploadResult
}

export interface IWorkExperience {
    companyName: string;
    role: string;
    yearsOfExperience: string;
    proof: ImageUploadResult
}

export type Status = "Pending" | "Rejected" | "Approved";

export type GovernmentIdType = "aadhar_card" | "driving_licence"

export interface IDesigner {
    id: string;
    userId: mongoose.Types.ObjectId;
    phone: string;
    state: string
    city: string;
    district: string;
    governmentIdType: GovernmentIdType;
    govtIdImage: ImageUploadResult;
    education: IEducation[];
    workExperience?: IWorkExperience[];
    portfolioUrl: string;
    status: Status;
    rejectionReason?: string;
    createdAt: Date,
    bio: string
}

export interface IDesign {
    id: string;
    userId: mongoose.Types.ObjectId;
    name: string;
    propertyType: string
    spaceType: string
    startingPrice: string;
    district: string;
    services: string[];
    designStyles: string[]
    description: string
    coverImage: ImageUploadResult;
    gallery: ImageUploadResult[];
    createdAt: Date;
}

export type JobApplicationStatus = "Pending" | "Completed" | "Rejected" | "Ongoing"

export interface IJobApplication {
    id:string
    customerId: mongoose.Types.ObjectId
    designerId: mongoose.Types.ObjectId
    jobId: mongoose.Types.ObjectId
    status: JobApplicationStatus,
    rejectionReason?: string
    createdAt: Date
}



