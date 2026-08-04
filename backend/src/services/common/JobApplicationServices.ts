import type { AllJobApplicationsDTO, IJobApplicationRequestDTO, JobApplicationFilter, JobApplicationApprovalOrRejectionRequestDTO, JobApplicationApprovalOrRejectionResponseDTO, MyJobApplicationsDTO } from "../../DTO/designer/jobsDTO";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse";
import type { IActiveJobRepository, IJobRepository } from "../../interfaces/customer/ICustomerRepository";
import type { IJobApplicationRepository } from "../../interfaces/designer/IDesignerRepository";
import type { IJobApplicationService } from "../../interfaces/designer/IDesignerService";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages";
import { JobApplicationMapper } from "../../dtoMappers/designer/JobApplicationMapper";
import { JOB_APPLICATION_STATUS, SOURCE_TYPE } from "../../shared/enums/commonEnums";


export class JobApplicationService implements IJobApplicationService {
    constructor(private _jobApplicationRepo: IJobApplicationRepository, private _jobRequestRepo: IJobRepository, private _activeJobRepo: IActiveJobRepository) { }

    async applyForJob(data: IJobApplicationRequestDTO): Promise<IApiResponse> {
        console.log(data)

        const jobExists = await this._jobRequestRepo.getJobRequest(data.jobId)
        if (!jobExists) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const alreadyApplied = await this._jobApplicationRepo.checkUserJobApplication(data.userId, data.jobId)
        if (alreadyApplied) {
            throw new AppError(JOB_MESSAGES.JOB_APPLICATION.ALREADY_APPLIED, RESPONSE_CODE.CONFILT)
        }
        await this._jobApplicationRepo.applyForJob(jobExists.userId.id, data);
        return {
            message: JOB_MESSAGES.JOB_APPLICATION.APPLIED_SUCCESS,
            success: true,
            statuscode: RESPONSE_CODE.OK
        }
    }

    async deleteJobApplication(id: string): Promise<IApiResponse> {
        const result = await this._jobApplicationRepo.deleteJobApplication(id);
        if (!result) {
            throw new AppError(JOB_MESSAGES.JOB_APPLICATION.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        return {
            success: true,
            message: JOB_MESSAGES.JOB_APPLICATION.DELETED_SUCCESS,
            statuscode: RESPONSE_CODE.OK
        }
    }

    async approveOrRejectJobApplication(id: string, data: JobApplicationApprovalOrRejectionRequestDTO): Promise<IApiResponse<JobApplicationApprovalOrRejectionResponseDTO>> {

        if (data.status === JOB_APPLICATION_STATUS.ONGOING) {
            await this._jobApplicationRepo.changeStatusForPendingUser(id, data.jobId)
        }
        const result = await this._jobApplicationRepo.approveOrRejectJobApplication(id, data);
        if (!result) {
            throw new AppError(JOB_MESSAGES.JOB_APPLICATION.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        if (result.status === JOB_APPLICATION_STATUS.ONGOING) {
            const jobStatusUpdated = await this._jobRequestRepo.changeStatus(result.jobId.toString(), result.status);
            if (!jobStatusUpdated) {
                throw new AppError(JOB_MESSAGES.JOB_REQUEST.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
            }
            const activeJob = await this._activeJobRepo.createActiveJOb({
                userId: jobStatusUpdated.userId.toString(),
                designerId: result.designerId.toString(),
                sourceId: jobStatusUpdated.id,
                sourceType: SOURCE_TYPE.JOB_REQUEST,
                sourceName:jobStatusUpdated.projectTitle
            })
           
            if (!activeJob) {
                throw new AppError(JOB_MESSAGES.JOB_REQUEST.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
            }
        }

        const jobApplicationData = JobApplicationMapper.toJobApplicationApprovalOrRejectionDTO(result)

        return {
            success: true,
            message: JOB_MESSAGES.JOB_APPLICATION.STATUS_UPDATED_SUCCESS,
            statuscode: RESPONSE_CODE.OK,
            data: jobApplicationData
        }
    }


    async getJobApplications(jobId: string, filters?: JobApplicationFilter): Promise<IApiResponseWithPagination<AllJobApplicationsDTO[]>> {

        const jobRequestExists = await this._jobRequestRepo.getJobRequest(jobId)
        if (!jobRequestExists) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const { data, pagination } = await this._jobApplicationRepo.getJobApplications(jobId, filters);
        const jobApplicationsData = JobApplicationMapper.toJobApplicationDTOList(data)
        return {
            message: JOB_MESSAGES.JOB_APPLICATION.ALL_JOB_APPLICATIONS,
            data: jobApplicationsData,
            statuscode: RESPONSE_CODE.OK,
            success: true,
            total: pagination.total,
            totalPages: pagination.totalPages
        }
    }



    async getMyJobApplications(userId: string, filters?: JobApplicationFilter): Promise<IApiResponseWithPagination<MyJobApplicationsDTO[]>> {
        const result = await this._jobApplicationRepo.getMyJobApplications(userId, filters);
        const jobApplicationData = JobApplicationMapper.toMyJobApplicationDTOlist(result.data)
        return {
            message: JOB_MESSAGES.JOB_APPLICATION.MY_JOB_APPLICATIONS,
            data: jobApplicationData,
            statuscode: RESPONSE_CODE.OK,
            success: true,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages
        }
    }

}