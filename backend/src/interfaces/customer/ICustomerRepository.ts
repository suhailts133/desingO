import type { ClientSession } from "mongoose";
import type { Pagination } from "../../DTO/admin/adminDTO";
import type { CustomerInteraction, CustomerInteractionPopulated } from "../../DTO/common/interaction";
import type { ActiveJobFilter, ActiveJobPopulateAll, ActiveJobPopulated, CreateActiveJobDTO } from "../../DTO/user/activeJobDTO";
import type { HireDesignerFilter } from "../../DTO/user/hireDesignerDTO";

import type { createJobRepoDTO, EditJobRepoData, JobFilter } from "../../DTO/user/jobsDTO";
import type { ImageUploadResult } from "../base/IImageUpload";
import type { IActiveJob, ICustomerInteraction, IJobRequest, IJobRequestCustomerPopulated, IJobRequestPopulated, Source_type, JobStatus } from "./ICustomer";

export interface IJobRepository {
    createJobRequest(data: createJobRepoDTO, referenceImages?: ImageUploadResult[], floorplans?: ImageUploadResult[]): Promise<IJobRequest>;
    getjobRequestPerDesign(designId: string, filters?: HireDesignerFilter): Promise<{ data: IJobRequestCustomerPopulated[], pagination: Pagination }>
    getMyJobs(userId: string, sourceType: Source_type, page?: string): Promise<{ data: IJobRequest[], pagination: Pagination }>
    getAllJobs(jobFilter?: JobFilter): Promise<{ data: IJobRequestPopulated[], pagination: Pagination }>;
    deleteAJob(id: string): Promise<boolean>;
    getJobRequest(id: string): Promise<IJobRequestPopulated | null>
    editJobRequest(id: string, data: EditJobRepoData, referenceImages?: ImageUploadResult[], finalFloorPlans?: ImageUploadResult[]): Promise<boolean>
    changeStatus(id: string, status: JobStatus,session?:ClientSession): Promise<IJobRequest | null>
    updateHireRequest(id: string, data: Partial<IJobRequest>): Promise<IJobRequest | null>
    countJobs(userId: string): Promise<number>
    findMostRecent(): Promise<IJobRequestPopulated[]>;
    findCandidatesExcluding(): Promise<IJobRequestPopulated[]>
}



export interface IActiveJobRepository {
    countCustomerActiveJobs(userId: string): Promise<number>
    countDesignerActiveJobs(designerId: string): Promise<number>
    countAllActiveJob(): Promise<number>
    getActiveJob(id: string): Promise<IActiveJob | null>
    updateActiveJob(jobId: string, data: Partial<IActiveJob>): Promise<IActiveJob | null>
    getActiveJobBySource(id: string): Promise<IActiveJob | null>
    getActiveJobPopulated(id: string): Promise<ActiveJobPopulateAll | null>
    getAllActiveJobPerDesigner(designerId: string): Promise<IActiveJob[]>
    createActiveJOb(data: CreateActiveJobDTO,session?:ClientSession): Promise<IActiveJob>
    getCustomerActiveJobs(customerId: string, filter?: ActiveJobFilter): Promise<{ data: ActiveJobPopulated[], pagination: Pagination }>
    getDesignerActiveJobs(designerId: string, filter?: ActiveJobFilter): Promise<{ data: ActiveJobPopulated[], pagination: Pagination }>
}


export interface ICustomerInteractionRepository {
    createInteraction(data: CustomerInteraction): Promise<ICustomerInteraction>
    getRecentInteractios(customerId: string): Promise<CustomerInteractionPopulated[]>
    getSavedDesignids(customerId: string): Promise<string[]>
}