import type { IJobRequestService } from "../interfaces/customer/ICustomerService.js";
import type { Request, Response } from "express";
import { jobRequestValidation } from "../validators/user/jobValidator.js";
import { RespsonseHelper } from "../helpers/responseHelper.js";
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js";
import type { ICreateJobRequest } from "../interfaces/customer/ICustomer.js";
import { ensureError } from "../helpers/errors/ensureError.js";
export class CustomerController {
    constructor(private _jobRequestService: IJobRequestService) { }

    addJobRequest = async (req: Request, res: Response) => {
        try {
            const { error, value } = jobRequestValidation.validate(req.body, { stripUnknown: true })
            if (error) {
                const err = error.details[0]?.message || "Missing fields or Invalid Data"
                RespsonseHelper.error(res, "Validation failed", err, RESPONSE_CODE.BAD_REQUEST)
            }
            const validatedData = value as ICreateJobRequest
            const user = req.user?.userId;
            if (!user) {
                return RespsonseHelper.error(res, "userid not found", "userid not found", RESPONSE_CODE.BAD_REQUEST)
            }
            const result = await this._jobRequestService.addJobRequest(user, validatedData);
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err);
            RespsonseHelper.error(res, "Server error", "Server error", RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }


    getAllJobs = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId
            if (!userId) {
                RespsonseHelper.error(res, "user not found", "user not found", RESPONSE_CODE.INTERNAL_SERVER_ERROR)
            }
            const { page } = req.query;
            const result = await this._jobRequestService.getAllJobs(userId as string, page as string)
            RespsonseHelper.successWithPagination(res, result)
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While Fetching all job requests", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }


    getAJob = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                return RespsonseHelper.error(res, "Job id is required", "Missing id in params", RESPONSE_CODE.BAD_REQUEST);
            }
            const result = await this._jobRequestService.getAJobRequest(id as string)
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While Fetching job request", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }

    getAllJobsCommon = async (req: Request, res: Response) => {
        try {
            const result = await this._jobRequestService.getJobRequestcommon(req.query)
            RespsonseHelper.successWithPagination(res, result)
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While Fetching all job requests", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }

    deleteAJob = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                return RespsonseHelper.error(res, "Job id is required", "Missing id in params", RESPONSE_CODE.BAD_REQUEST);
            }
            console.log(id, "ddd")
            const result = await this._jobRequestService.deleteAJob(id as string)
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While deleting job request", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }
}