import type { JobDetailResponseDTO, JobFilter, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO.js";
import type { IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse.js";
import type { ICreateJobRequest } from "./ICustomer.js";

export interface IJobRequestService {
    addJobRequest(userId:string, data:ICreateJobRequest):Promise<IApiResponse>
    getAllJobs(userId:string, page?:string):Promise<IApiResponseWithPagination<JobsResponseDTO[]>>
    getAJobRequest(jobId:string):Promise<IApiResponse<JobDetailResponseDTO>>
    getJobRequestcommon(JobFilter?:JobFilter):Promise<IApiResponseWithPagination<JobsCommonResponseDTO[]>>
    deleteAJob(id:string):Promise<IApiResponse>
}