import type { CustomerDashboardDTO } from "../../DTO/common/dashboard";
import type { GetAllDesignCommonResponseDTO } from "../../DTO/designer/designDTO";
import type {  ActiveJobResponseDTO, ActiveJobsQueryParams } from "../../DTO/user/activeJobDTO";
import type { AcceptOrRejectHireDesignerDTO } from "../../DTO/user/hireDesignerDTO";
import type { EditJobRequest, HireDesignerDTO, HireDesignerQueryParam, JobDetailResponseDTO, JobFilter, JobsCommonResponseDTO, JobsResponseDTO, MyJobsQueryParams } from "../../DTO/user/jobsDTO";
import type { IApiResponse, IApiResponseWithPagination, IApiResponseWithRecomendation } from "../base/IApiResponse";
import type { JobChatValidation } from "../socket/ISocket";
import type {  ICreateJobRequest } from "./ICustomer";

export interface IJobRequestService {
    addJobRequest(userId: string, data: ICreateJobRequest, refrenceImages?: Express.Multer.File[], floorPlanImages?: Express.Multer.File[]): Promise<IApiResponse>
    editJobRequest(jobId: string, data: EditJobRequest, refrenceImages?: Express.Multer.File[], floorPlanImages?: Express.Multer.File[]): Promise<IApiResponse>
    getMyJobs(userId: string, filter?:MyJobsQueryParams): Promise<IApiResponseWithPagination<JobsResponseDTO[]>>
    getJobRequestDetail(jobId: string, designerId?: string): Promise<IApiResponse<JobDetailResponseDTO>>
    getAllJobs(JobFilter?: JobFilter): Promise<IApiResponseWithPagination<JobsCommonResponseDTO[]>>
    deleteAJob(id: string): Promise<IApiResponse>
    getjobRequestPerDesign(designId: string, filters?: HireDesignerQueryParam): Promise<IApiResponseWithPagination<HireDesignerDTO[]>>
    acceptOrRejectHireRequest(id: string, data: AcceptOrRejectHireDesignerDTO): Promise<IApiResponse>
    getRecentJobs(): Promise<IApiResponseWithRecomendation<JobsCommonResponseDTO[]>>
}


export interface IActiveJobService {
    getCustomerActiveJobs(id: string, filter?: ActiveJobsQueryParams): Promise<IApiResponseWithPagination<ActiveJobResponseDTO[]>>
    getDesignerActiveJobs(id: string, filter?: ActiveJobsQueryParams): Promise<IApiResponseWithPagination<ActiveJobResponseDTO[]>>
    validateJobForChat(activeJobId: string, userId: string, activeCheckSkip?:boolean): Promise<JobChatValidation>
}


export interface ICustomerInteractionService {
    _getCustomerTasteVector(customerId: string): Promise<number[] | null>
    getRecomendedDesigns(customerId: string): Promise<IApiResponseWithRecomendation<GetAllDesignCommonResponseDTO[]>>
}



export interface ICustomerDashboardService {
    getCustomerDashboard(customer: string): Promise<IApiResponse<CustomerDashboardDTO>>
}
