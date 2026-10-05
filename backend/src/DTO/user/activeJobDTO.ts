import type { IUser } from "../../interfaces/auth/IUser";
import type { sortByTypes } from "../../interfaces/base/IApiResponse";
import type { ActiveJobProposalStatus, ActiveJobSource, ActiveJobStatus, IActiveJob, IHireDesigner, IJobRequest } from "../../interfaces/customer/ICustomer";

export type ActiveJobPopulateAll = Omit<IActiveJob, "userId" | "designerId" | "sourceId" | "sourceType"> & {
    userId: IUser
    designerId: IUser
} & (
        {
            sourceType: 'jobRequest'
            sourceId: IJobRequest
        } |
        {
            sourceType: 'direct_hire'
            sourceId: IHireDesigner
        }
    )

export type ActiveJobPopulated= Omit<IActiveJob, "userId" | "designerId"> & {
    userId: IUser
    designerId: IUser
}


export interface CreateActiveJobDTO {
    userId: string
    designerId: string
    sourceType: 'jobRequest' | 'direct_hire'
    sourceId: string
    sourceName: string
}


export interface ActiveJobFilter {
    sourceType: 'jobRequest' | 'direct_hire'
    page?: string
}



export interface ActiveJobResponseDTO {
    id: string,
    sourceType: 'jobRequest' | 'direct_hire'
    sourceName: string,
    sourceId: string,
    userName: string,
    profileImage?: string,
    status: 'Active' | 'Completed' | 'Cancelled'
    proposalStatus: "NOT_CREATED" | "CREATED" | "REJECTED"
    startedAt: string
}



export interface ActiveJobsQueryParams {
  sourceName?: string;
  status?: ActiveJobStatus ;
  proposalStatus?: ActiveJobProposalStatus ;
  sortBy?: sortByTypes;
  startDate?: string;
  endDate?: string;
  page?: number;
  sourceType?: ActiveJobSource ;
}
