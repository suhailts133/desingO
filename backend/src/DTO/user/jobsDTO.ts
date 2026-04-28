import type { ImageUploadResult } from "../../interfaces/base/IImageUpload.js"
import type { IJobRequest, IRoomMeasurement } from "../../interfaces/customer/ICustomer.js"

export type JobStatus = "Pending" | "Closed" | "Ongoing"

export interface JobsResponseDTO {
    id: string
    projectTitle: string,
    propertyType: string,
    description: string,
    timeLine: string,
    status: JobStatus
    rooms: number
    city: string
    district: string
    state: string
    minBudget: number
    maxBudget: number
}

export interface EditJobRequest {
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
    oldReferences?: ImageUploadResult[];
}


export type EditJobRepoData = Omit<EditJobRequest, "EditJobRequest">


export type JobsCommonResponseDTO = Omit<JobsResponseDTO, "status"> & {
    name: string,
    createdAt: string
    designStyles: string[]
}


export type JobDetailResponseDTO = Omit<IJobRequest, "userId" | "createdAt" | "referenceImages"> & {
    name: string
    userCreatedAt: string
    createdAt: string,
    referenceImages: ImageUploadResult[]
}


export interface JobFilter {
    page?: string,
    designStyles?: string
    propertyTypes?: string
    timeLines?: string
    sortBy?: string
}
