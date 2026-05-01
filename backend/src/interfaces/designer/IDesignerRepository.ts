import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { createDesignDTO, DesignDetailResponseDTO, DesignFilter, EditDesignRepoData, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO.js";
import type { DesignerCardDTO, DesignerFilter } from "../../DTO/designer/designerDTO.js";
import type { DesignerVerificationDTO } from "../../DTO/designer/designerVerificationDTOs.js";
import type { AllJobApplicationsDTO, IJobApplicationRequestDTO, JobApplicationFilter, JobApplicationApprovalOrRejectionRequestDTO, JobApplicationApprovalOrRejectionResponseDTO, MyJobApplicationsDTO } from "../../DTO/designer/jobsDTO.js";
import type { DesignerUpdateRequestDTO } from "../../DTO/profile/profileDTO.js";
import type { ImageUploadResult } from "../base/IImageUpload.js";
import type { IDesign, IDesigner } from "./IDesigner.js";


export interface IDesignerRepository {
    createDesignerRequest(data: DesignerVerificationDTO): Promise<boolean>;
    getDesigner(userId: string): Promise<IDesigner | null>;
    updateDesigner(designerId: string, data: DesignerUpdateRequestDTO): Promise<IDesigner | null>
    getAllDesigners(designFilter?: DesignerFilter): Promise<{ data: DesignerCardDTO[], pagination: Pagination }>
}


export interface IDesignRepository {
    createDesign(data: createDesignDTO): Promise<boolean>;
    getAllDesigns(userId: string, page?: string): Promise<{ data: getAllDesignsResponseDTO[], pagination: Pagination }>
    getDesignDetail(designId: string): Promise<DesignDetailResponseDTO | null>,
    getAllDesignCommon(designFilter?: DesignFilter): Promise<{ data: GetAllDesignCommonResponseDTO[], pagination: Pagination }>;
    deleteADesign(id: string): Promise<boolean>;
    getDesign(id: string): Promise<IDesign | null>
    editDesign(id: string, data: EditDesignRepoData, coverImage?: ImageUploadResult, gallery?: ImageUploadResult[]): Promise<boolean>
}


export interface IJobApplicationRepository {
    applyForJob(customerId: string, data: IJobApplicationRequestDTO): Promise<void>
    checkUserJobApplication(userId: string, jobId: string): Promise<boolean>
    deleteJobApplication(id: string): Promise<boolean>
    changeStatusForPendingUser(id: string, jobId: string): Promise<void>
    approveOrRejectJobApplication(id: string, data: JobApplicationApprovalOrRejectionRequestDTO): Promise<JobApplicationApprovalOrRejectionResponseDTO | null>
    getMyJobApplications(userId: string, filters?: JobApplicationFilter): Promise<{ data: MyJobApplicationsDTO[], pagination: Pagination }>
    getAllJobApplications(userId: string, filters?: JobApplicationFilter): Promise<{ data: AllJobApplicationsDTO[], pagination: Pagination }>
}