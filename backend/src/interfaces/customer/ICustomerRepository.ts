import type { Pagination } from "../../DTO/admin/adminDTO.js";

import type { EditJobRepoData, JobFilter} from "../../DTO/user/jobsDTO.js";
import type { ImageUploadResult } from "../base/IImageUpload.js";
import type { ICreateJobRequest, IJobRequest, IJobRequestPopulated } from "./ICustomer.js";

export interface IJobRepository {
    createJobRequest(userId: string, data: ICreateJobRequest, referenceImages?: ImageUploadResult[]): Promise<boolean>;
    getMyJobs(userId: string, page?: string): Promise<{ data: IJobRequest[], pagination: Pagination }>
    getAllJobs(JobFilter?: JobFilter): Promise<{ data: IJobRequestPopulated[], pagination: Pagination }>;
    deleteAJob(id: string): Promise<boolean>;
    getJobRequest(id: string): Promise<IJobRequestPopulated | null>
    editJobRequest(id: string, data: EditJobRepoData, referenceImages?: ImageUploadResult[]): Promise<boolean>


}