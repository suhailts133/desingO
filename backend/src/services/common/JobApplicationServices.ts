import type { AllJobApplicationsDTO, IJobApplicationRequestDTO, JobApplicationFilter, JobApplicationApprovalOrRejectionRequestDTO, JobApplicationApprovalOrRejectionResponseDTO, MyJobApplicationsDTO } from "../../DTO/designer/jobsDTO.js";
import { MESSAGES } from "../../shared/messages/messages.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { AppError } from "../../shared/errors/appError.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import type { IJobRepository } from "../../interfaces/customer/ICustomerRepository.js";
import type { IJobApplicationRepository } from "../../interfaces/designer/IDesignerRepository.js";
import type { IJobApplicationService } from "../../interfaces/designer/IDesignerService.js";

export class JobApplicationService implements IJobApplicationService {
    constructor(private _jobApplicationRepo: IJobApplicationRepository, private _jobRequestRepo: IJobRepository) { }

    async applyForJob(data: IJobApplicationRequestDTO): Promise<IApiResponse> {
        const jobExists = await this._jobRequestRepo.getJobRequest(data.jobId)
        if (!jobExists) {
            throw new AppError(MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        // let count = 0;

  
        


        const alreadyApplied = await this._jobApplicationRepo.checkUserJobApplication(data.userId, data.jobId)
        if (alreadyApplied) {
            throw new AppError(MESSAGES.JOB_APPLICATION.ALREADY_APPLIED, RESPONSE_CODE.CONFILT)
        }
        await this._jobApplicationRepo.applyForJob(jobExists.userId.toString(), data);
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

        if (data.status === "Ongoing") {
            await this._jobApplicationRepo.changeStatusForPendingUser(id, data.jobId)
        }
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


    async getAllJobApplications(userId: string, filters?: JobApplicationFilter): Promise<IApiResponseWithPagination<AllJobApplicationsDTO[]>> {
     
        const { data, pagination } = await this._jobApplicationRepo.getAllJobApplications(userId, filters);
     
        return {
            message: MESSAGES.JOB_APPLICATION.ALL_JOB_APPLICATIONS,
            data,
            statuscode: RESPONSE_CODE.OK,
            success: true,
            total: pagination.total,
            totalPages: pagination.totalPages
        }
    }
    async getMyJobApplications(userId: string, filters?: JobApplicationFilter): Promise<IApiResponseWithPagination<MyJobApplicationsDTO[]>> {
        const result = await this._jobApplicationRepo.getMyJobApplications(userId, filters);
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