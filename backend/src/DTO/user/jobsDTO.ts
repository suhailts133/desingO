import type { IJobRequest } from "../../interfaces/customer/ICustomer.js"

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
    price: string
}


export type JobsCommonResponseDTO = Omit<JobsResponseDTO, "status"> & {
    name: string,
    createdAt: string
    designStyles: string[]
}


export type JobDetailResponseDTO = Omit<IJobRequest, "userId" | "createdAt"> & {
    name: string
    userCreatedAt: string
    createdAt: string
}


export interface JobFilter {
    page?: string,
    designStyles?: string
    propertyTypes?: string
    timeLines?:string
    sortBy?: string
}
