import type { IHireDesignerService } from "../../interfaces/customer/ICustomerService.js";
import { isObjectId } from "../../shared/helpers/extraFunctions.js";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages.js";
import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/appError.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { directHireValidation } from "../../validators/user/jobValidator.js";
import type { HireDesignerPayload } from "../../interfaces/customer/ICustomer.js";
import { RespsonseHelper } from "../../shared/helpers/responseHelper.js";
import { directHireQueryFilters } from "../../validators/user/hireDesignerValidator.js";
import Logger from "../../config/logger.js";
export class HireDesignerController {
    constructor(private _hireDesignerService: IHireDesignerService) { }

    hireDesigner = asyncHandler(async (req: Request, res: Response) => {
        const userid = req.user?.userId;
        Logger.info(`${userid} userid`)
        if (!userid) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        if (!isObjectId(userid)) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const { error, value } = directHireValidation.validate(req.body, { stripUnknown: true, convert: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const validedData = value as HireDesignerPayload
        const result = await this._hireDesignerService.createHireDesigner(userid, validedData);
        RespsonseHelper.success(res, result)
    })
      
    getMyHireDesignerRequests = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = directHireQueryFilters.validate(req.query, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Invalid query parameters", RESPONSE_CODE.BAD_REQUEST)
        }
        const userid = req.user?.userId;
        if (!userid) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        if (!isObjectId(userid)) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }

        const result = await this._hireDesignerService.getMyHireDesignerRequests(userid, value)
        RespsonseHelper.successWithPagination(res, result)
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

        const result = await this._hireDesignerService.getHireRequestPerDesign(designId, value)
        RespsonseHelper.successWithPagination(res, result)
    })
}