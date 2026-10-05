import type { SortByTypes } from "../../../api/responseType";

export interface ActiveJobResponseDTO {
  id: string;
  sourceType: ActiveJobSource;
  sourceName: string;
  sourceId: string;
  userName: string;
  profileImage?: string;
  status: ActiveJobStatus;
  proposalStatus: ActiveJobProposalStatus;
  startedAt: string;
}

export type ActiveJobStatus = "Active" | "Completed" | "Cancelled" | "Terminated";
export type ActiveJobProposalStatus = "NOT_CREATED" | "CREATED" | "REJECTED";
export type ActiveJobSource = "jobRequest" | "direct_hire";



export interface ActiveJobsQueryParams {
  sourceName?: string;
  status?: ActiveJobStatus | "All";
  proposalStatus?: ActiveJobProposalStatus | "All";
  sortBy?: SortByTypes;
  startDate?: string;
  endDate?: string;
  page: number;
  sourceType: ActiveJobSource | "All";
}
