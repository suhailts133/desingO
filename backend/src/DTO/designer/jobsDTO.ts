import type { JobApplicationStatus } from "../../interfaces/designer/IDesigner.js";


export interface IJobApplicationRequestDTO {
    userId: string,
    jobId: string
}

export interface JobApplicationApprovalOrRejectionRequestDTO {
    status: "Approved" | "Rejected",
    rejectionReason?: string,
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
}

export interface AllJobApplicationsDTO {
    status: JobApplicationStatus,
    rejectionReason?: string,
    jobId: string,
    jobTitle: string
    designerId: string,
    designerName: string
}

export interface JobAllicationFilter {
    page?: string,
    status?: JobApplicationStatus,
}
