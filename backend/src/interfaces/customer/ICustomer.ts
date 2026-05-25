import type mongoose from "mongoose";
import type { ImageUploadResult } from "../base/IImageUpload.js";
import type { IUser } from "../auth/IUser.js";

export interface IRoomMeasurement {
    spaceType: string;
    length: string;
    width: string;
    ceilingHeight?: string;
    unit: string
    notes?: string;
}


export type JobStatus = "Pending" | "Ongoing" | "Closed"

export interface IJobRequest {
    id: string;
    userId: mongoose.Types.ObjectId
    projectTitle: string;
    propertyType: string;
    designStyles: string[];
    city: string;
    district: string;
    state: string;
    phone: string;
    timeline: string;
    minBudget: number;
    maxBudget: number;
    description: string;
    rooms: IRoomMeasurement[];
    status: JobStatus
    createdAt: Date,
    services: string[]
    referenceImages: ImageUploadResult[]
}

export type IJobRequestPopulated = Omit<IJobRequest, "userId"> & {
    userId: IUser
}


export type ICreateJobRequest = Omit<IJobRequest, "id" | "userId" | "status">



export interface IBid {
    timeLine: string
    amount: number,
    description: string
}


export interface IHireDesigner {
    id: string
    userId: mongoose.Types.ObjectId
    designerId: mongoose.Types.ObjectId
    designId: mongoose.Types.ObjectId
    spaceType: string,
    length: string;
    width: string;
    ceilingHeight: string;
    unit: string
    notes: string;
    status: "Accepted" | "Rejected" | "Pending",
    rejectionReason?: string
    services: string[]
    timeLine: string,
    createdAt: Date,
    expiresAt: Date
}


export interface IActiveJob {
    id: string
    userId: mongoose.Types.ObjectId
    designerId: mongoose.Types.ObjectId
    sourceType: 'jobRequest' | 'direct_hire'
    sourceId: mongoose.Types.ObjectId
    sourceName:string
    status: 'Active' | 'Completed' | 'Cancelled'
    startedAt: Date
    completedAt?: Date
    cancelledAt?: Date
    createdAt: Date
}


export type HireDesignerPayload = Omit<IHireDesigner, "id" | "userId" | "designId" | "designerId" | "spaceType"> & {
    designId: string
}
