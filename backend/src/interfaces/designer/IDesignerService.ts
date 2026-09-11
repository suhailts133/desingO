import type { DesignerDashboardDTO } from "../../DTO/common/dashboard";
import type { AddDesignRequestDTO, DesignDetailResponseDTO, DesignFiles, DesignFilter, DesignGallaryDTO, EditDesign, EditDesignFiles, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO";
import type { DesignerCardDTO, DesignerFilter } from "../../DTO/designer/designerDTO";
import type { DesignerVerificationBodyDTO } from "../../DTO/designer/designerVerificationDTOs";
import type { AllJobApplicationsDTO, IJobApplicationRequestDTO, JobApplicationFilter, JobApplicationApprovalOrRejectionRequestDTO, JobApplicationApprovalOrRejectionResponseDTO, MyJobApplicationsDTO } from "../../DTO/designer/jobsDTO";
import type { JobsCommonResponseDTO } from "../../DTO/user/jobsDTO";
import type { IApiResponse, IApiResponseWithPagination, IApiResponseWithRecomendation } from "../base/IApiResponse";
import type { WarningDTO } from "../benchmark/IBenchMark";
import type { DesignerVerificationFiles } from "./IDesigner";

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
    getRecentDesigns(): Promise<IApiResponseWithRecomendation<GetAllDesignCommonResponseDTO[]>>
    getDesignGallary(designerId: string, page?: string): Promise<IApiResponseWithPagination<DesignGallaryDTO[]>>
}


export interface IJobApplicationService {
    applyForJob(data: IJobApplicationRequestDTO): Promise<IApiResponse>
    deleteJobApplication(id: string): Promise<IApiResponse>
    approveOrRejectJobApplication(id: string, data: JobApplicationApprovalOrRejectionRequestDTO): Promise<IApiResponse<JobApplicationApprovalOrRejectionResponseDTO>>
    getMyJobApplications(userId: string, filters?: JobApplicationFilter): Promise<IApiResponseWithPagination<MyJobApplicationsDTO[]>>
    getJobApplications(jobId: string, filters?: JobApplicationFilter): Promise<IApiResponseWithPagination<AllJobApplicationsDTO[]>>
}


export interface IDesignerDashboardService {
    getDesignerDashboard(designerId: string): Promise<IApiResponse<DesignerDashboardDTO>>
}


export interface IDesignerInteractionService {
    _getDesignerTasteVector(designerId: string): Promise<number[] | null>
    getRecomendedJobs(designerId: string): Promise<IApiResponseWithRecomendation<JobsCommonResponseDTO[]>>
}
