import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { createDesignDTO, DesignDetailResponseDTO, DesignFilter, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO.js";
import type { DesignerVerificationDTO } from "../../DTO/designer/designerVerificationDTOs.js";
import type { AllJobApplicationsDTO, IJobApplicationRequestDTO, JobAllicationFilter, JobApplicationApprovalOrRejectionRequestDTO, JobApplicationApprovalOrRejectionResponseDTO, MyJobApplicationsDTO } from "../../DTO/designer/jobsDTO.js";
import type { IDesigner } from "./IDesigner.js";
export interface IDesignerRepository {
    createDesignerRequest(data: DesignerVerificationDTO): Promise<boolean>;
    getDesigner(userId: string): Promise<IDesigner | null>;
}

export interface IDesignRepository {
    createDesign(data: createDesignDTO): Promise<boolean>;
    getAllDesigns(userId: string, page?: string): Promise<{ data: getAllDesignsResponseDTO[], pagination: Pagination }>
    getDesignDetail(designId: string): Promise<DesignDetailResponseDTO | null>,
    getAllDesignCommon(designFilter?: DesignFilter): Promise<{ data: GetAllDesignCommonResponseDTO[], pagination: Pagination }>;
    deleteADesign(id: string): Promise<boolean>;
}

export interface IJobApplicationRepository {
    applyForJob(data: IJobApplicationRequestDTO): Promise<void>
    checkUserJobApplication(userId:string, jobId:string):Promise<boolean>
    deleteJobApplication(id: string): Promise<boolean>
    approveOrRejectJobApplication(id: string, data: JobApplicationApprovalOrRejectionRequestDTO): Promise<JobApplicationApprovalOrRejectionResponseDTO | null>
    getMyJobApplications(userId: string, filters?: JobAllicationFilter): Promise<{ data: MyJobApplicationsDTO[], pagination: Pagination }>
    getAllJobApplications(filters?: JobAllicationFilter): Promise<{ data: AllJobApplicationsDTO[], pagination: Pagination }>
}