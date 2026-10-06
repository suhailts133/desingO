import type { SortByTypes } from "../../../api/responseType";

export interface JobApplicationQueryParms {
  page: number;
  status?: JobApplicationStatus | "All";
  id?: string;
  sortBy?: SortByTypes;
  startDate?: string;
  endDate?: string;
}

export type JobApplicationStatus = "Pending" | "Completed" | "Rejected" | "Ongoing";



export interface AllJobApplicationsDTO {
  status: JobApplicationStatus;
  rejectionReason?: string;
  jobId: string;
  jobTitle: string;
  designerId: string;
  designerName: string;
  propertyType: string;
  timeLine: string;
  id: string;
  createdOn: string;
}

export interface MyJobApplicationsDTO {
  status: JobApplicationStatus;
  rejectionReason?: string;
  jobId: string;
  jobTitle: string;
  id: string;
  propertyType: string;
  timeLine: string;
  numberOfRooms: number;
}

export interface JobApplicationApprovalOrRejectionPayload {
  id: string;
  status: "Ongoing" | "Rejected";
  rejectionReason?: string;
  jobId: string;
}

export interface RejectionPayload {
  rejectionReason: string;
}
