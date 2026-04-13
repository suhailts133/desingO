export interface JobApplicationQueryParms {
    page?: number,
    status?:JobApplicationStatus
}


export type JobApplicationStatus = "Pending" | "Approved" | "Rejected" | "Ongoing"


export interface MyJobApplicationsDTO {
    status: JobApplicationStatus,
    rejectionReason?: string,
    jobId: string,
    jobTitle: string
    id: string
    propertyType:string,
    timeLine:string,
    numberOfRooms:number,
    description:string
    createdOn:string
}