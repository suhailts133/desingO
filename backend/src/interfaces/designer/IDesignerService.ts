import type { AddDesignRequestDTO, DesignDetailResponseDTO, DesignFiles, DesignFilter, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO.js";
import type { DesignerVerificationBodyDTO } from "../../DTO/designer/designerVerificationDTOs.js";
import type { AllJobApplicationsDTO, IJobApplicationRequestDTO, JobApplicationFilter, JobApplicationApprovalOrRejectionRequestDTO, JobApplicationApprovalOrRejectionResponseDTO, MyJobApplicationsDTO } from "../../DTO/designer/jobsDTO.js";
import type { IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse.js";
import type { DesignerVerificationFiles } from "./IDesigner.js";

export interface IDesignerService {
    designerVerification(userId: string, email: string, data: DesignerVerificationBodyDTO, files: DesignerVerificationFiles): Promise<IApiResponse>

}


export interface IDesignService {
    addDesign(userId: string, data: AddDesignRequestDTO, files: DesignFiles): Promise<IApiResponse>
    getAllDesigns(userId: string, page?: string): Promise<IApiResponseWithPagination<getAllDesignsResponseDTO[]>>
    getDesignDetail(designId: string): Promise<IApiResponse<DesignDetailResponseDTO>>
    getAllDesignCommon(designFilter?: DesignFilter): Promise<IApiResponseWithPagination<GetAllDesignCommonResponseDTO[]>>
    deleteADesign(id: string): Promise<IApiResponse>
}


export interface IJobApplicationService {
    applyForJob(data: IJobApplicationRequestDTO): Promise<IApiResponse>
    deleteJobApplication(id: string): Promise<IApiResponse>
    approveOrRejectJobApplication(id: string, data: JobApplicationApprovalOrRejectionRequestDTO): Promise<IApiResponse<JobApplicationApprovalOrRejectionResponseDTO>>
    getMyJobApplications(userId: string, filters?: JobApplicationFilter): Promise<IApiResponseWithPagination<MyJobApplicationsDTO[]>>
    getAllJobApplications(userId:string, filters?: JobApplicationFilter): Promise<IApiResponseWithPagination<AllJobApplicationsDTO[]>>
}