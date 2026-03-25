import type mongoose from "mongoose";

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
    budget: string;
    description: string;
    rooms: IRoomMeasurement[];
    status: JobStatus
    createdAt:Date
}

export type ICreateJobRequest = Omit<IJobRequest, "id" | "userId" | "status">