import type { CustomerDashboardDTO } from "../../DTO/common/dashboard";
import type { GetAllDesignCommonResponseDTO } from "../../DTO/designer/designDTO";
import type { ActiveJobFilter, ActiveJobResponseDTO } from "../../DTO/user/activeJobDTO";
import type { AcceptOrRejectHireDesignerDTO, getHireDesignerPerDesignResponseDTO, getMyHireDesignerRequestResponseDTO, HireDesignerFilter } from "../../DTO/user/hireDesignerDTO";
import type { EditJobRequest, HireDesignerDTO, JobDetailResponseDTO, JobFilter, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO";
import type { IApiResponse, IApiResponseWithPagination, IApiResponseWithRecomendation } from "../base/IApiResponse";
import type { WarningDTO } from "../benchmark/IBenchMark";
import type { MessageRole } from "../chat/IChat";
import type { HireDesignerPayload, ICreateJobRequest, Source_type } from "./ICustomer";

export interface IJobRequestService {
    addJobRequest(userId: string, data: ICreateJobRequest, refrenceImages?: Express.Multer.File[], floorPlanImages?: Express.Multer.File[]): Promise<IApiResponse>
    editJobRequest(jobId: string, data: EditJobRequest, refrenceImages?: Express.Multer.File[], floorPlanImages?: Express.Multer.File[]): Promise<IApiResponse>
    getMyJobs(userId: string, sourceType: Source_type, page?: string): Promise<IApiResponseWithPagination<JobsResponseDTO[]>>
    getJobRequestDetail(jobId: string): Promise<IApiResponse<JobDetailResponseDTO>>
    getAllJobs(JobFilter?: JobFilter): Promise<IApiResponseWithPagination<JobsCommonResponseDTO[]>>
    deleteAJob(id: string): Promise<IApiResponse>
    getjobRequestPerDesign(designId: string, filters?: HireDesignerFilter): Promise<IApiResponseWithPagination<HireDesignerDTO[]>>
    acceptOrRejectHireRequest(id: string, data: AcceptOrRejectHireDesignerDTO): Promise<IApiResponse>
}


export interface IHireDesignerService {
    acceptOrRejectHireRequest(id: string, data: AcceptOrRejectHireDesignerDTO): Promise<IApiResponse>
    deleteHireDesigenr(id: string): Promise<IApiResponse>
    createHireDesigner(userId: string, data: HireDesignerPayload): Promise<IApiResponse<WarningDTO>>
    getMyHireDesignerRequests(userId: string, filters?: HireDesignerFilter): Promise<IApiResponseWithPagination<getMyHireDesignerRequestResponseDTO[]>>
    getHireRequestPerDesign(designId: string, filters?: HireDesignerFilter): Promise<IApiResponseWithPagination<getHireDesignerPerDesignResponseDTO[]>>
}


export interface IActiveJobService {
    getCustomerActiveJobs(id: string, filter?: ActiveJobFilter): Promise<IApiResponseWithPagination<ActiveJobResponseDTO[]>>
    getDesignerActiveJobs(id: string, filter?: ActiveJobFilter): Promise<IApiResponseWithPagination<ActiveJobResponseDTO[]>>
    validateJobForChat(activeJobId: string, userId: string): Promise<MessageRole>
}


export interface ICustomerInteractionService {
    _getCustomerTasteVector(customerId: string): Promise<number[] | null>
    getRecomendedDesigns(customerId: string): Promise<IApiResponseWithRecomendation<GetAllDesignCommonResponseDTO[]>>
}



export interface ICustomerDashboardService {
    getCustomerDashboard(customer: string): Promise<IApiResponse<CustomerDashboardDTO>>
}
