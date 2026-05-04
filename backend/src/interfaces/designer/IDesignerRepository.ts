import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { createDesignDTO, DesignFilter, EditDesignRepoData } from "../../DTO/designer/designDTO.js";
import type { DesignerFilter } from "../../DTO/designer/designerDTO.js";
import type { DesignerVerificationDTO } from "../../DTO/designer/designerVerificationDTOs.js";
import type {  IJobApplicationRequestDTO, JobApplicationFilter, JobApplicationApprovalOrRejectionRequestDTO } from "../../DTO/designer/jobsDTO.js";
import type { DesignerUpdateRequestDTO } from "../../DTO/profile/profileDTO.js";
import type { ImageUploadResult } from "../base/IImageUpload.js";
import type { IDesign, IDesigner, IDesignerPopulated, IDesignPopulated, IJobApplication, IJobApplicationPopulated, IJobApplicationPopulatedWithJobAndUser } from "./IDesigner.js";


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

    editDesign(id: string, data: EditDesignRepoData, coverImage?: ImageUploadResult, gallery?: ImageUploadResult[]): Promise<boolean>
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