import type { IJobRequestService } from "../../interfaces/customer/ICustomerService.js";
import type { Request, Response } from "express";
import { EditjobRequestValidation, jobRequestValidation } from "../../validators/user/jobValidator.js";
import { RespsonseHelper } from "../../shared/helpers/responseHelper.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import type { ICreateJobRequest } from "../../interfaces/customer/ICustomer.js";
import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError.js";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages.js";
import type { EditJobRequest } from "../../DTO/user/jobsDTO.js";
import { isObjectId } from "../../shared/helpers/extraFunctions.js";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages.js";
export class JobController {
    constructor(private _jobRequestService: IJobRequestService) { }

    postJobRequest = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = jobRequestValidation.validate(req.body, { stripUnknown: true, convert: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const validatedData = value as ICreateJobRequest
        const user = req.user?.userId;
        if (!user) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const files = req.files as {
            refrenceImages?: Express.Multer.File[]
        }

        const refrenceImages: Express.Multer.File[] = files.refrenceImages ?? []

        const result = await this._jobRequestService.addJobRequest(user, validatedData, refrenceImages);
        RespsonseHelper.success(res, result)
    })

    editJobRequest = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = EditjobRequestValidation.validate(req.body, { stripUnknown: true, convert: true })
        if (error) {

            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const jobRequestId = req.params.id as string;
        if (jobRequestId) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(jobRequestId)) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const validatedData = value as EditJobRequest
        
        const files = req.files as {
            referenceImages?: Express.Multer.File[]
        }
        const referenceImages: Express.Multer.File[] = files?.referenceImages ?? []
        const result = await this._jobRequestService.editJobRequest(jobRequestId, validatedData, referenceImages)
        RespsonseHelper.success(res, result)
    })

    getMyJobs = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const { page } = req.query;
        const result = await this._jobRequestService.getMyJobs(userId as string, page as string)
        RespsonseHelper.successWithPagination(res, result)
    })


    getJobDetails = asyncHandler(async (req: Request, res: Response) => {
        const jobRequestId = req.params.id as string;
        if (jobRequestId) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(jobRequestId)) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._jobRequestService.getJobRequestDetail(jobRequestId)
        RespsonseHelper.success(res, result)
    })

    getAllJobs = asyncHandler(async (req: Request, res: Response) => {
        const result = await this._jobRequestService.getAllJobs(req.query)
        RespsonseHelper.successWithPagination(res, result)
    })

    deleteAJob = asyncHandler(async (req: Request, res: Response) => {
       const jobRequestId = req.params.id as string;
        if (jobRequestId) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(jobRequestId)) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._jobRequestService.deleteAJob(jobRequestId)
        RespsonseHelper.success(res, result)
    })
}