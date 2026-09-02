import type { Pagination } from "../../DTO/admin/adminDTO";
import type { createDesignDTO, DesignFilter, EditDesignRepoData } from "../../DTO/designer/designDTO";
import type { DesignerFilter } from "../../DTO/designer/designerDTO";
import type { DesignerVerificationDTO } from "../../DTO/designer/designerVerificationDTOs";
import type { IJobApplicationRequestDTO, JobApplicationFilter, JobApplicationApprovalOrRejectionRequestDTO } from "../../DTO/designer/jobsDTO";
import type { DesignerUpdateRequestDTO } from "../../DTO/profile/profileDTO";
import type { ImageUploadResult } from "../base/IImageUpload";
import type { SpaceTypeAvg } from "../benchmark/IBenchMark";
import type { IDesign, IDesigner, IDesignerPopulated, IDesignPopulated, IJobApplication, IJobApplicationPopulated, IJobApplicationPopulatedWithJobAndUser } from "./IDesigner";


export interface IDesignerRepository {
    createDesignerRequest(data: DesignerVerificationDTO): Promise<boolean>;
    getDesigner(userId: string): Promise<IDesigner | null>;
    updateDesigner(designerId: string, data: DesignerUpdateRequestDTO): Promise<IDesigner | null>
    getAllDesigners(designFilter?: DesignerFilter): Promise<{ data: IDesignerPopulated[], pagination: Pagination }>
}


export interface IDesignRepository {
    createDesign(data: createDesignDTO): Promise<boolean>;
    getMyDesigns(userId: string, page?: string): Promise<{ data: IDesign[], pagination: Pagination }>
    getDesign(designId: string): Promise<IDesignPopulated | null>,
    getAllDesigns(designFilter?: DesignFilter): Promise<{ data: IDesignPopulated[], pagination: Pagination }>;
    deleteADesign(id: string): Promise<boolean>;
    countMyDesigns(userId: string): Promise<number>
    editDesign(id: string, data: EditDesignRepoData, coverImage?: ImageUploadResult, gallery?: ImageUploadResult[]): Promise<boolean>
    computeAvgPriceBySpaceType(): Promise<SpaceTypeAvg[]>
    findMostRecent(limit: number): Promise<IDesignPopulated[]>;
    findCandidatesExcluding(excludedIds: string[]): Promise<IDesignPopulated[]>;
}


export interface IJobApplicationRepository {
    applyForJob(customerId: string, data: IJobApplicationRequestDTO): Promise<void>
    checkUserJobApplication(userId: string, jobId: string): Promise<boolean>
    deleteJobApplication(id: string): Promise<boolean>
    changeStatusForPendingUser(id: string, jobId: string): Promise<void>
    approveOrRejectJobApplication(id: string, data: JobApplicationApprovalOrRejectionRequestDTO): Promise<IJobApplication | null>
    getMyJobApplications(jobId: string, filters?: JobApplicationFilter): Promise<{ data: IJobApplicationPopulated[], pagination: Pagination }>
    getJobApplications(userId: string, filters?: JobApplicationFilter): Promise<{ data: IJobApplicationPopulatedWithJobAndUser[], pagination: Pagination }>
}