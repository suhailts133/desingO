import type { JobApplicationStatus } from "../../interfaces/designer/IDesigner";


export interface IJobApplicationRequestDTO {
    userId: string,
    jobId: string
}

export interface JobApplicationApprovalOrRejectionRequestDTO {
    status: "Ongoing" | "Rejected",
    rejectionReason?: string,
    jobId: string
}

export interface JobApplicationApprovalOrRejectionResponseDTO extends JobApplicationApprovalOrRejectionRequestDTO {
    jobId: string
}

export interface MyJobApplicationsDTO {
    status: JobApplicationStatus,
    rejectionReason?: string,
    jobId: string,
    jobTitle: string
    id: string
    propertyType: string,
    timeLine: string,
    numberOfRooms: number,
    description: string
    createdOn: string

}

export interface AllJobApplicationsDTO {
    status: JobApplicationStatus,
    rejectionReason?: string,
    jobId: string,
    jobTitle: string
    designerId: string,
    designerName: string
    propertyType: string,
    timeLine: string
    id: string
    createdOn: string
}
export interface JobApplicationFilter {
    page?: string,
    status?: JobApplicationStatus,
    sort?: "asc" | "desc",
    startDate?: string,
    endDate?: string,
}