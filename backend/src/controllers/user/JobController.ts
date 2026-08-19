import type { IJobRequestService } from "../../interfaces/customer/ICustomerService.js";
import type { Request, Response } from "express";
import { EditjobRequestValidation, jobRequestValidation } from "../../validators/user/jobValidator.js";
import { RespsonseHelper } from "../../shared/helpers/responseHelper.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import type { ICreateJobRequest, Source_type } from "../../interfaces/customer/ICustomer.js";
import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError.js";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages.js";
import type { EditJobRequest } from "../../DTO/user/jobsDTO.js";
import { isObjectId } from "../../shared/helpers/extraFunctions.js";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages.js";
import Logger from "../../config/logger.js";
import { directHireApprovalOrRejectionValidation, directHireQueryFilters } from "../../validators/user/hireDesignerValidator.js";
import type { AcceptOrRejectHireDesigner } from "../../DTO/user/hireDesignerDTO.js";
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
            referenceImages?: Express.Multer.File[]
            floorPlans?: Express.Multer.File[]
        }

        const refrenceImages: Express.Multer.File[] = files.referenceImages ?? []
        const floorPlanImages: Express.Multer.File[] = files.floorPlans ?? []

        const result = await this._jobRequestService.addJobRequest(user, validatedData, refrenceImages, floorPlanImages);
        RespsonseHelper.success(res, result)
    })

    editJobRequest = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = EditjobRequestValidation.validate(req.body, { stripUnknown: true, convert: true })
        if (error) {

            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const jobRequestId = req.params.id as string;
        if (!jobRequestId) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(jobRequestId)) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const validatedData = value as EditJobRequest

        const files = req.files as {
            referenceImages?: Express.Multer.File[]
            floorPlans?: Express.Multer.File[]
        }

        Logger.info(JSON.stringify(validatedData))
        const referenceImages: Express.Multer.File[] = files?.referenceImages ?? []
        const floorPlanImages: Express.Multer.File[] = files.floorPlans ?? []
        const result = await this._jobRequestService.editJobRequest(jobRequestId, validatedData, referenceImages, floorPlanImages)
        RespsonseHelper.success(res, result)
    })



    getRequestPerDesign = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = directHireQueryFilters.validate(req.query, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Invalid query parameters", RESPONSE_CODE.BAD_REQUEST)
        }
        const designId = req.params?.id as string;
        if (!designId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        if (!isObjectId(designId)) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }

        const result = await this._jobRequestService.getjobRequestPerDesign(designId, value)
        RespsonseHelper.successWithPagination(res, result)
    })

    acceptOrRejectHireRequest = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = directHireApprovalOrRejectionValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Invalid body parameters", RESPONSE_CODE.BAD_REQUEST)
        }

        const validated = value as AcceptOrRejectHireDesigner
        const result = await this._jobRequestService.acceptOrRejectHireRequest(validated.requestId, {
            ...(validated.rejectionReason && { rejectionReason: validated.rejectionReason }),
            status: validated.status
        })

        RespsonseHelper.success(res, result)
    })


    getMyJobs = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const { page, sourceType } = req.query;

        if (typeof sourceType !== "string" || (sourceType !== "JOB_REQUEST" && sourceType !== "DIRECT_HIRE")) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.SOURCE_INVALID, RESPONSE_CODE.BAD_REQUEST);
        }

        const result = await this._jobRequestService.getMyJobs(userId as string, sourceType as Source_type, page as string)
        RespsonseHelper.successWithPagination(res, result)
    })


    getJobDetails = asyncHandler(async (req: Request, res: Response) => {
        const jobRequestId = req.params.id as string;
        console.log(jobRequestId)
        if (!jobRequestId) {
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
        if (!jobRequestId) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(jobRequestId)) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._jobRequestService.deleteAJob(jobRequestId)
        RespsonseHelper.success(res, result)
    })
}