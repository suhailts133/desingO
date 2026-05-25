export interface JobApplicationQueryParms {
    page?: number,
    status?: JobApplicationStatus,
    id: string,
    sort?: "asc" | "desc",        
    startDate?: string,
    endDate?: string,              
}

export type JobApplicationStatus = "Pending" | "Approved" | "Rejected" | "Ongoing"

export type DateFilter = "Latest" | "Oldest" | "Today" | "Custom";


export interface AllJobApplicationsDTO {
    status: JobApplicationStatus,
    rejectionReason?: string,
    jobId: string,
    jobTitle: string
    designerId: string,
    designerName: string
    propertyType:string,
    timeLine:string,
    id:string
    createdOn:string
}

export interface MyJobApplicationsDTO {
    status: JobApplicationStatus,
    rejectionReason?: string,
    jobId: string,
    jobTitle: string
    id: string
    propertyType:string,
    timeLine:string,
    numberOfRooms:number,

}


export interface JobApplicationApprovalOrRejectionPayload {
    id:string
    status: "Ongoing" | "Rejected",
    rejectionReason?: string,
    jobId:string
}


export interface JobApplicationRejection{
    rejectionReason:string
}