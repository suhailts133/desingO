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
    referenceImages:ImageUploadResult[]
}

export type IJobRequestPopulated = Omit<IJobRequest, "userId"> & {
    userId:IUser
}


export type ICreateJobRequest = Omit<IJobRequest, "id" | "userId" | "status">



export interface IBid {
    timeLine: string
    amount: number,
    description: string
}
