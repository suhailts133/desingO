import type { AllJobApplicationsDTO, IJobApplicationRequestDTO, JobAllicationFilter, JobApplicationApprovalOrRejectionRequestDTO, JobApplicationApprovalOrRejectionResponseDTO, MyJobApplicationsDTO } from "../../DTO/designer/jobsDTO.js";
import { MESSAGES } from "../../helpers/enums/messages.js";
import { RESPONSE_CODE } from "../../helpers/enums/statusCode.js";
import { AppError } from "../../helpers/errors/appError.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import type { IJobApplicationRepository } from "../../interfaces/designer/IDesignerRepository.js";
import type { IJobApplicationService } from "../../interfaces/designer/IDesignerService.js";

export class JobApplicationService implements IJobApplicationService {
    constructor(private _jobApplicationRepo: IJobApplicationRepository) { }

    async applyForJob(data: IJobApplicationRequestDTO): Promise<IApiResponse> {
        const alreadyApplied = await this._jobApplicationRepo.checkUserJobApplication(data.userId, data.jobId)
        if (alreadyApplied) {
            throw new AppError(MESSAGES.JOB_APPLICATION.ALREADY_APPLIED, RESPONSE_CODE.CONFILT)
        }
        await this._jobApplicationRepo.applyForJob(data);
        return {
            message: MESSAGES.JOB_APPLICATION.APPLIED_SUCCESS,
            success: true,
            statuscode: RESPONSE_CODE.OK
        }
    }

    async deleteJobApplication(id: string): Promise<IApiResponse> {
        const result = await this._jobApplicationRepo.deleteJobApplication(id);
        if (!result) {
            throw new AppError(MESSAGES.JOB_APPLICATION.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        return {
            success: true,
            message: MESSAGES.JOB_APPLICATION.DELETED_SUCCESS,
            statuscode: RESPONSE_CODE.OK
        }
    }

    async approveOrRejectJobApplication(id: string, data: JobApplicationApprovalOrRejectionRequestDTO): Promise<IApiResponse<JobApplicationApprovalOrRejectionResponseDTO>> {
        const result = await this._jobApplicationRepo.approveOrRejectJobApplication(id, data);
        if (!result) {
            throw new AppError(MESSAGES.JOB_APPLICATION.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        return {
            success: true,
            message: MESSAGES.JOB_APPLICATION.STATUS_UPDATED_SUCCESS,
            statuscode: RESPONSE_CODE.OK,
            data: result
        }
    }


    async getAllJobApplications(filters?: JobAllicationFilter): Promise<IApiResponseWithPagination<AllJobApplicationsDTO[]>> {
        const result = await this._jobApplicationRepo.getAllJobApplications(filters);
        return {
            message: MESSAGES.JOB_APPLICATION.ALL_JOB_APPLICATIONS,
            data: result.data,
            statuscode: RESPONSE_CODE.OK,
            success: true,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages
        }
    }
    async getMyJobApplications(userId: string, filters?: JobAllicationFilter): Promise<IApiResponseWithPagination<MyJobApplicationsDTO[]>> {
        const result = await this._jobApplicationRepo.getMyJobApplications(userId,filters);
        return {
            message: MESSAGES.JOB_APPLICATION.MY_JOB_APPLICATIONS,
            data: result.data,
            statuscode: RESPONSE_CODE.OK,
            success: true,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages
        }
    }

}