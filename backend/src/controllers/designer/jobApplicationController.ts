import { type Request, type Response } from "express";
import type { IJobApplicationService } from "../../interfaces/designer/IDesignerService";
import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { jobApplicationApprovalOrRejectionValidation, JobApplicationsQueryFilter, jobApplicationValidation } from "../../validators/designers/jobApplicationValidations";
import type { IJobApplicationRequestDTO, JobApplicationApprovalOrRejectionRequestDTO } from "../../DTO/designer/jobsDTO";
import { RespsonseHelper } from "../../shared/helpers/responseHelper";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages";
import { isObjectId } from "../../shared/helpers/extraFunctions";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";

export class JobApplicationController {
    constructor(private _jobApplicationService: IJobApplicationService) { }

    applyForJob = asyncHandler(async (req: Request, res: Response) => {

        const { error, value } = jobApplicationValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        console.log(value)

        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const data: IJobApplicationRequestDTO = {
            userId,
            jobId: value.jobId,
        }
        const result = await this._jobApplicationService.applyForJob(data)
        RespsonseHelper.success(res, result)
    })

    deleteJobApplication = asyncHandler(async (req: Request, res: Response) => {
        const jobApplicationId = req.params.id as string;
        if (!jobApplicationId) {
            throw new AppError(JOB_MESSAGES.JOB_APPLICATION.CHECK_JOB_APPLICATION_ID, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(jobApplicationId)) {
            throw new AppError(JOB_MESSAGES.JOB_APPLICATION.CHECK_JOB_APPLICATION_ID, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._jobApplicationService.deleteJobApplication(jobApplicationId);
        RespsonseHelper.success(res, result)
    })


    approveOrRejectJobApplication = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = jobApplicationApprovalOrRejectionValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }

        const jobApplicationId = req.params.id
        if (!jobApplicationId) {
            throw new AppError(JOB_MESSAGES.JOB_APPLICATION.CHECK_JOB_APPLICATION_ID, RESPONSE_CODE.BAD_REQUEST)
        }

        const result = await this._jobApplicationService.approveOrRejectJobApplication(jobApplicationId as string, value as JobApplicationApprovalOrRejectionRequestDTO)
        RespsonseHelper.success(res, result)
    })


    getMyJobApplications = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = JobApplicationsQueryFilter.validate(req.query, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Invalid query parameters", RESPONSE_CODE.BAD_REQUEST)
        }

        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }

        const result = await this._jobApplicationService.getMyJobApplications(userId, value)
        RespsonseHelper.success(res, result)
    })

    getJobApplications = asyncHandler(async (req: Request, res: Response) => {

        const { error, value } = JobApplicationsQueryFilter.validate(req.query, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Invalid query parameters", RESPONSE_CODE.BAD_REQUEST)
        }
        const jobId = req.params.id as string
        if (!jobId) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(jobId)) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }

        const result = await this._jobApplicationService.getJobApplications(jobId, value)
        RespsonseHelper.successWithPagination(res, result)
    })
}