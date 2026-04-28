import { type Request, type Response } from "express";
import type { IJobApplicationService } from "../interfaces/designer/IDesignerService.js";
import asyncHandler from "express-async-handler";
import { AppError } from "../helpers/errors/appError.js";
import { MESSAGES } from "../helpers/enums/messages.js";
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js";
import { jobApplicationApprovalOrRejectionValidation, JobApplicationsQueryFilter, jobApplicationValidation } from "../validators/designers/jobApplicationValidations.js";
import type { IJobApplicationRequestDTO, JobApplicationApprovalOrRejectionRequestDTO } from "../DTO/designer/jobsDTO.js";
import { RespsonseHelper } from "../helpers/responseHelper.js";

export class JobApplicationController {
    constructor(private _jobApplicationService: IJobApplicationService) { }

    applyForJob = asyncHandler(async (req: Request, res: Response) => {
     
        const { error, value } = jobApplicationValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }

        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const data: IJobApplicationRequestDTO = {
            userId,
            jobId: value.jobId,
        }
        const result = await this._jobApplicationService.applyForJob(data)
        RespsonseHelper.success(res, result)
    })

    deleteJobApplication = asyncHandler(async (req: Request, res: Response) => {
        const jobApplicationId = req.params.id;
        if (!jobApplicationId) {
            throw new AppError(MESSAGES.JOB_APPLICATION.CHECK_JOB_APPLICATION_ID, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._jobApplicationService.deleteJobApplication(jobApplicationId as string);
        RespsonseHelper.success(res, result)
    })


    approveOrRejectJobApplication = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = jobApplicationApprovalOrRejectionValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }

        const jobApplicationId = req.params.id
        if (!jobApplicationId) {
            throw new AppError(MESSAGES.JOB_APPLICATION.CHECK_JOB_APPLICATION_ID, RESPONSE_CODE.BAD_REQUEST)
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
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }

        const result = await this._jobApplicationService.getMyJobApplications(userId, value)
        RespsonseHelper.success(res, result)
    })

    getAllJobApplications = asyncHandler(async (req: Request, res: Response) => {

        const { error, value } = JobApplicationsQueryFilter.validate(req.query, { stripUnknown: true })
        if (error) {
            console.log("qeuery error")
            throw new AppError(error.details[0]?.message || "Invalid query parameters", RESPONSE_CODE.BAD_REQUEST)
        }
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }

        const result = await this._jobApplicationService.getAllJobApplications(userId,value)
        RespsonseHelper.successWithPagination(res, result)
    })
}