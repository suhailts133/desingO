import type { IHireDesignerService } from "../../interfaces/customer/ICustomerService.js";
import { isObjectId } from "../../shared/helpers/extraFunctions.js";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages.js";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import { AppError } from "../../shared/errors/appError.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { directHireValidation } from "../../validators/user/jobValidator.js";
import type { HireDesignerPayload } from "../../interfaces/customer/ICustomer.js";
import { RespsonseHelper } from "../../shared/helpers/responseHelper.js";
import { directHireApprovalOrRejectionValidation, directHireQueryFilters } from "../../validators/user/hireDesignerValidator.js";
import Logger from "../../config/logger.js";
import type { AcceptOrRejectHireDesigner } from "../../DTO/user/hireDesignerDTO.js";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages.js";

/**
 * This controller handle workflow related to directly hiring a designer
 */
export class HireDesignerController {
    constructor(private _hireDesignerService: IHireDesignerService) { }



    /**
     * to hire a designer directly
     * 
     * @route POST /hireDesignerRoute/create
     * @param req.body {@link HireDesignerPayload}
     * @throws {AppError} 400 if there is any issue with req.body
     * @throws {AppError} 401 if user is authenticated
    */
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


    /**
     * to get all the hire request the client has put
     * @route POST /hireDesignerRoute/my
     * @throws {AppError} 400 if there is any issue with req.query
     * @throws {AppError} 401 if user is authenticated
    */
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



    /**
     * to get all the hire request that a designer gotten per design
     * @route POST /hireDesignerRoute/design/requests/:id
     * @throws {AppError} 400 if there is any issue with req.query or if there is no vaild design id
    */
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


    /**
    * to accept or rejct the request the customer has given
    * @route PATCH /hireDesignerRoute/accept-reject
    * @throws {AppError} 400 if there is any issue with req.body
   */
    acceptOrRejectHireRequest = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = directHireApprovalOrRejectionValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Invalid body parameters", RESPONSE_CODE.BAD_REQUEST)
        }

        const validated = value as AcceptOrRejectHireDesigner
        const result = await this._hireDesignerService.acceptOrRejectHireRequest(validated.hireRequestId, {
            ...(validated.rejectionReason && { rejectionReason: validated.rejectionReason }),
            status: validated.status
        })

        RespsonseHelper.success(res, result)
    })



    /**
    * to delete the hire request
    * @route DELETE /hireDesignerRoute/request/:id
    * @throws {AppError} 400 if there is any issue with req.params.id
   */
    deleteHireRequest = asyncHandler(async (req: Request, res: Response) => {
        const requestId = req.params.id as string

        if (!isObjectId(requestId)) {
            throw new AppError(JOB_MESSAGES.HIRE_DESIGNER.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._hireDesignerService.deleteHireDesigenr(requestId)
        RespsonseHelper.success(res, result)
    })
}