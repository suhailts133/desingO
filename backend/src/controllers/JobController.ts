import type { IJobRequestService } from "../interfaces/customer/ICustomerService.js";
import type { Request, Response } from "express";
import { EditjobRequestValidation, jobRequestValidation } from "../validators/user/jobValidator.js";
import { RespsonseHelper } from "../helpers/responseHelper.js";
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js";
import type { ICreateJobRequest } from "../interfaces/customer/ICustomer.js";
import asyncHandler from "express-async-handler";
import { AppError } from "../helpers/errors/appError.js";
import { MESSAGES } from "../helpers/enums/messages.js";
import type { EditJobRequest } from "../DTO/user/jobsDTO.js";
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
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
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
        const { id } = req.params;
        if (!id) {
            throw new AppError(MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const validatedData = value as EditJobRequest
        console.log("from controlelr: ", validatedData)
        const files = req.files as {
            referenceImages?: Express.Multer.File[]
        }
        const referenceImages: Express.Multer.File[] = files?.referenceImages ?? []
        const result = await this._jobRequestService.editJobRequest(id as string, validatedData, referenceImages)
        RespsonseHelper.success(res, result)
    })

    getMyJobs = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const { page } = req.query;
        const result = await this._jobRequestService.getAllJobs(userId as string, page as string)
        RespsonseHelper.successWithPagination(res, result)
    })


    getJobDetails = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new AppError(MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._jobRequestService.getAJobRequest(id as string)
        RespsonseHelper.success(res, result)
    })

    getAllJobs = asyncHandler(async (req: Request, res: Response) => {
        const result = await this._jobRequestService.getJobRequestcommon(req.query)
        RespsonseHelper.successWithPagination(res, result)
    })

    deleteAJob = asyncHandler(async (req: Request, res: Response) => {

        const { id } = req.params;
        if (!id) {
            throw new AppError(MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._jobRequestService.deleteAJob(id as string)
        RespsonseHelper.success(res, result)
    })
}