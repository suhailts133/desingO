import type { Pagination } from "../../DTO/admin/adminDTO.js";

import type { EditJobRepoData, JobDetailResponseDTO, JobFilter, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO.js";
import type { ImageUploadResult } from "../base/IImageUpload.js";
import type { ICreateJobRequest, IJobRequest } from "./ICustomer.js";

export interface IJobRepository {
    createJobRequest(userId: string, data: ICreateJobRequest, referenceImages?: ImageUploadResult[]): Promise<boolean>;
    getAllJobs(userId: string, page?: string): Promise<{ data: JobsResponseDTO[], pagination: Pagination }>
    getAJobRequest(jobId: string): Promise<JobDetailResponseDTO | null>
    getAllJobsCommon(JobFilter?: JobFilter): Promise<{ data: JobsCommonResponseDTO[], pagination: Pagination }>;
    deleteAJob(id: string): Promise<boolean>;
    getJobRequest(id: string): Promise<IJobRequest | null>
    editJobRequest(id: string, data: EditJobRepoData, referenceImages?: ImageUploadResult[]): Promise<boolean>


}