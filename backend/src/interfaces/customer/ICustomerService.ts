import type { ActiveJobFilter, ActiveJobResponseDTO } from "../../DTO/user/activeJobDTO.js";
import type { getHireDesignerPerDesignResponseDTO, getMyHireDesignerRequestResponseDTO, HireDesignerFilter } from "../../DTO/user/hireDesignerDTO.js";
import type { EditJobRequest, JobDetailResponseDTO, JobFilter, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO.js";
import type { IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse.js";
import type { WarningDTO } from "../benchmark/IBenchMark.js";
import type { MessageRole } from "../chat/IChat.js";
import type { HireDesignerPayload, ICreateJobRequest } from "./ICustomer.js";

export interface IJobRequestService {
    addJobRequest(userId: string, data: ICreateJobRequest, refrenceImages?: Express.Multer.File[]): Promise<IApiResponse>
    editJobRequest(jobId: string, data: EditJobRequest, refrenceImages?: Express.Multer.File[]): Promise<IApiResponse>
    getMyJobs(userId: string, page?: string): Promise<IApiResponseWithPagination<JobsResponseDTO[]>>
    getJobRequestDetail(jobId: string): Promise<IApiResponse<JobDetailResponseDTO>>
    getAllJobs(JobFilter?: JobFilter): Promise<IApiResponseWithPagination<JobsCommonResponseDTO[]>>
    deleteAJob(id: string): Promise<IApiResponse>
}


export interface IHireDesignerService {
    createHireDesigner(userId: string, data: HireDesignerPayload): Promise<IApiResponse<WarningDTO>>
    getMyHireDesignerRequests(userId: string, filters?: HireDesignerFilter): Promise<IApiResponseWithPagination<getMyHireDesignerRequestResponseDTO[]>>
    getHireRequestPerDesign(designId: string, filters?: HireDesignerFilter): Promise<IApiResponseWithPagination<getHireDesignerPerDesignResponseDTO[]>>
}


export interface IActiveJobService {
    getCustomerActiveJobs(id: string, filter?: ActiveJobFilter): Promise<IApiResponseWithPagination<ActiveJobResponseDTO[]>>
    getDesignerActiveJobs(id: string, filter?: ActiveJobFilter): Promise<IApiResponseWithPagination<ActiveJobResponseDTO[]>>
    validateJobForChat(activeJobId:string, userId:string):Promise<MessageRole>
}