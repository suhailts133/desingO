import type { EditJobRequest, JobDetailResponseDTO, JobFilter, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO.js";
import type { IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse.js";
import type { IBid, ICreateJobRequest } from "./ICustomer.js";

export interface IJobRequestService {
    addJobRequest(userId: string, data: ICreateJobRequest, refrenceImages?: Express.Multer.File[]): Promise<IApiResponse>
    editJobRequest(jobId: string, data: EditJobRequest, refrenceImages?: Express.Multer.File[]): Promise<IApiResponse>
    getAllJobs(userId: string, page?: string): Promise<IApiResponseWithPagination<JobsResponseDTO[]>>
    getAJobRequest(jobId: string): Promise<IApiResponse<JobDetailResponseDTO>>
    getJobRequestcommon(JobFilter?: JobFilter): Promise<IApiResponseWithPagination<JobsCommonResponseDTO[]>>
    deleteAJob(id: string): Promise<IApiResponse>
}


export interface IBidService {
    addBid(userId: string, data: IBid): Promise<string>;
}