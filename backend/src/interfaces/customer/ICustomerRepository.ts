import type { Pagination } from "../../DTO/admin/adminDTO";
import type { CustomerInteraction, CustomerInteractionPopulated } from "../../DTO/common/interaction";
import type { ActiveJobFilter, ActiveJobPopulateAll, ActiveJobPopulated, CreateActiveJobDTO } from "../../DTO/user/activeJobDTO";
import type { CreateHireDesignerDTO, HireDesignerFilter, HireDesignerPopulatedALL, HireDesignerPopulateUser } from "../../DTO/user/hireDesignerDTO";

import type { EditJobRepoData, JobFilter } from "../../DTO/user/jobsDTO";
import type { ImageUploadResult } from "../base/IImageUpload";
import type { IActiveJob, ICreateJobRequest, IHireDesigner, ICustomerInteraction, IJobRequest, IJobRequestCustomerPopulated, IJobRequestPopulated, Source_type } from "./ICustomer";

export interface IJobRepository {
    createJobRequest(userId: string, data: ICreateJobRequest, referenceImages?: ImageUploadResult[], floorplans?: ImageUploadResult[]): Promise<boolean>;
    getjobRequestPerDesign(designId: string, filters?: HireDesignerFilter): Promise<{ data: IJobRequestCustomerPopulated[], pagination: Pagination }>
    getMyJobs(userId: string, sourceType: Source_type, page?: string): Promise<{ data: IJobRequest[], pagination: Pagination }>
    getAllJobs(JobFilter?: JobFilter): Promise<{ data: IJobRequestPopulated[], pagination: Pagination }>;
    deleteAJob(id: string): Promise<boolean>;
    getJobRequest(id: string): Promise<IJobRequestPopulated | null>
    editJobRequest(id: string, data: EditJobRepoData, referenceImages?: ImageUploadResult[], finalFloorPlans?: ImageUploadResult[]): Promise<boolean>
    changeStatus(id: string, status: string): Promise<IJobRequest | null>
    updateHireRequest(id: string, data: Partial<IJobRequest>): Promise<IJobRequest | null>
    countJobs(userId:string):Promise<number>


}

export interface IHireDesignerRepository {
    checkIfApplied(userId: string, designId: string): Promise<IHireDesigner | null>
    getHireDesignerByJobId(jobId: string): Promise<IHireDesigner | null>
    deleteHireDesigner(id: string): Promise<boolean>
    updateHireDesigner(id: string, data: Partial<IHireDesigner>): Promise<IHireDesigner | null>
    getHireDesignerById(id: string): Promise<IHireDesigner | null>
    createHireDesigner(data: CreateHireDesignerDTO): Promise<IHireDesigner>
    getMyHireDesignerRequests(userId: string, filters?: HireDesignerFilter): Promise<{ data: HireDesignerPopulatedALL[], pagination: Pagination }>
    getHireRequestPerDesign(designId: string, filters?: HireDesignerFilter): Promise<{ data: HireDesignerPopulateUser[], pagination: Pagination }>
}


export interface IActiveJobRepository {
    countCustomerActiveJobs(userId: string): Promise<number>
    getActiveJob(id: string): Promise<IActiveJob | null>
    updateActiveJob(jobId: string, data: Partial<IActiveJob>): Promise<IActiveJob | null>
    getActiveJobBySource(id: string): Promise<IActiveJob | null>
    getActiveJobPopulated(id: string): Promise<ActiveJobPopulateAll | null>
    getAllActiveJobPerDesigner(designerId: string): Promise<IActiveJob[]>
    createActiveJOb(data: CreateActiveJobDTO): Promise<IActiveJob>
    getCustomerActiveJobs(customerId: string, filter?: ActiveJobFilter): Promise<{ data: ActiveJobPopulated[], pagination: Pagination }>
    getDesignerActiveJobs(designerId: string, filter?: ActiveJobFilter): Promise<{ data: ActiveJobPopulated[], pagination: Pagination }>
}


export interface ICustomerInteractionRepository {
    createInteraction(data: CustomerInteraction): Promise<ICustomerInteraction>
    getRecentInteractios(customerId: string): Promise<CustomerInteractionPopulated[]>
    getSavedDesignids(customerId: string): Promise<string[]>
}