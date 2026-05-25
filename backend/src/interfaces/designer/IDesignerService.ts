import type { AddDesignRequestDTO, DesignDetailResponseDTO, DesignFiles, DesignFilter, DesignGallaryDTO, EditDesign, EditDesignFiles, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO.js";
import type { DesignerCardDTO, DesignerFilter } from "../../DTO/designer/designerDTO.js";
import type { DesignerVerificationBodyDTO } from "../../DTO/designer/designerVerificationDTOs.js";
import type { AllJobApplicationsDTO, IJobApplicationRequestDTO, JobApplicationFilter, JobApplicationApprovalOrRejectionRequestDTO, JobApplicationApprovalOrRejectionResponseDTO, MyJobApplicationsDTO } from "../../DTO/designer/jobsDTO.js";
import type { IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse.js";
import type { WarningDTO } from "../benchmark/IBenchMark.js";
import type { DesignerVerificationFiles } from "./IDesigner.js";

export interface IDesignerService {
    designerVerification(userId: string, email: string, data: DesignerVerificationBodyDTO, files: DesignerVerificationFiles): Promise<IApiResponse>
    getAllDesigners(designerFilter?: DesignerFilter): Promise<IApiResponseWithPagination<DesignerCardDTO[]>>
    getDesigner(designerId: string): Promise<IApiResponse<DesignerCardDTO>>

}


export interface IDesignService {
    addDesign(userId: string, data: AddDesignRequestDTO, files: DesignFiles): Promise<IApiResponse<WarningDTO>>
    editDesign(designId: string, data: EditDesign, files?: EditDesignFiles): Promise<IApiResponse>
    getMyDesigns(userId: string, page?: string): Promise<IApiResponseWithPagination<getAllDesignsResponseDTO[]>>
    getDesignDetail(designId: string, userId?: string): Promise<IApiResponse<DesignDetailResponseDTO>>
    getAllDesigns(userId?: string, designFilter?: DesignFilter): Promise<IApiResponseWithPagination<GetAllDesignCommonResponseDTO[]>>
    deleteADesign(id: string): Promise<IApiResponse>
    getDesignGallary(designerId: string, page?: string): Promise<IApiResponseWithPagination<DesignGallaryDTO[]>>
}


export interface IJobApplicationService {
    applyForJob(data: IJobApplicationRequestDTO): Promise<IApiResponse>
    deleteJobApplication(id: string): Promise<IApiResponse>
    approveOrRejectJobApplication(id: string, data: JobApplicationApprovalOrRejectionRequestDTO): Promise<IApiResponse<JobApplicationApprovalOrRejectionResponseDTO>>
    getMyJobApplications(userId: string, filters?: JobApplicationFilter): Promise<IApiResponseWithPagination<MyJobApplicationsDTO[]>>
    getJobApplications(jobId: string, filters?: JobApplicationFilter): Promise<IApiResponseWithPagination<AllJobApplicationsDTO[]>>
}




