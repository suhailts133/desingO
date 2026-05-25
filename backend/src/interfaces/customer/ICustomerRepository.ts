import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { ActiveJobFilter, ActiveJobPopulateAll, CreateActiveJobDTO } from "../../DTO/user/activeJobDTO.js";
import type { CreateHireDesignerDTO, HireDesignerFilter, HireDesignerPopulatedALL, HireDesignerPopulateUser } from "../../DTO/user/hireDesignerDTO.js";

import type { EditJobRepoData, JobFilter } from "../../DTO/user/jobsDTO.js";
import type { ImageUploadResult } from "../base/IImageUpload.js";
import type { IActiveJob, ICreateJobRequest, IHireDesigner, IJobRequest, IJobRequestPopulated } from "./ICustomer.js";

export interface IJobRepository {
    createJobRequest(userId: string, data: ICreateJobRequest, referenceImages?: ImageUploadResult[]): Promise<boolean>;
    getMyJobs(userId: string, page?: string): Promise<{ data: IJobRequest[], pagination: Pagination }>
    getAllJobs(JobFilter?: JobFilter): Promise<{ data: IJobRequestPopulated[], pagination: Pagination }>;
    deleteAJob(id: string): Promise<boolean>;
    getJobRequest(id: string): Promise<IJobRequestPopulated | null>
    editJobRequest(id: string, data: EditJobRepoData, referenceImages?: ImageUploadResult[]): Promise<boolean>
    changeStatus(id: string, status: string): Promise<IJobRequest | null>


}

export interface IHireDesignerRepository {
    checkIfApplied(userId: string, designId: string): Promise<IHireDesigner | null>
    createHireDesigner(data: CreateHireDesignerDTO): Promise<IHireDesigner>
    getMyHireDesignerRequests(userId: string, filters?: HireDesignerFilter): Promise<{ data: HireDesignerPopulatedALL[], pagination: Pagination }>
    getHireRequestPerDesign(designId: string, filters?: HireDesignerFilter): Promise<{ data: HireDesignerPopulateUser[], pagination: Pagination }>
}


export interface IActiveJobRepository {
    getActiveJob(id: string): Promise<IActiveJob | null>
    getActiveJobBySource(id: string): Promise<IActiveJob | null>
    getActiveJobPopulated(id: string): Promise<ActiveJobPopulateAll | null>
    getAllActiveJobPerDesigner(designerId: string): Promise<IActiveJob[]>
    createActiveJOb(data: CreateActiveJobDTO): Promise<IActiveJob>
    getCustomerActiveJobs(customerId: string, filter?: ActiveJobFilter): Promise<{ data: ActiveJobPopulateAll[], pagination: Pagination }>
    getDesignerActiveJobs(designerId: string, filter?: ActiveJobFilter): Promise<{ data: ActiveJobPopulateAll[], pagination: Pagination }>
}