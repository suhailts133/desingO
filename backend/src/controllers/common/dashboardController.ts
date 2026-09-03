import asyncHandler from "express-async-handler";
import type { Request, Response } from 'express'
import { AppError } from "../../shared/errors/appError";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import type { IDesignerDashboardService } from "../../interfaces/designer/IDesignerService";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";
import { isObjectId } from "../../shared/helpers/extraFunctions";
import { RespsonseHelper } from "../../shared/helpers/responseHelper";
import type { ICustomerDashboardService } from "../../interfaces/customer/ICustomerService";

/**
 * this class handle dasboard for all user types
 */
export class DashboardController {
    constructor(private _designerDashboardService: IDesignerDashboardService, private _cutomerDashboardService:ICustomerDashboardService) { }


    /**
     * this controller handle designer designer dashboard
     * 
     * @route GET /dashboard/designer
     * @throws {AppError} - 401 when you are unauthorized
     * @throws {AppError} - 400 if there is any issue with designerid
     */
    getDesignerDashboard = asyncHandler(async (req: Request, res: Response) => {
        const designerId = req.user?.userId;
        if (!designerId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        if (!isObjectId(designerId)) {
            throw new AppError(AUTH_MESSAGES.AUTH.NOT_DESIGNER, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._designerDashboardService.getDesignerDashboard(designerId);
        RespsonseHelper.success(res, result)
    })
    /**
     * this controller handle designer customer dashboard
     * 
     * @route GET /dashboard/customer
     * @throws {AppError} - 401 when you are unauthorized
     * @throws {AppError} - 400 if there is any issue with customerid
     */
    getCustomerDashboard = asyncHandler(async (req: Request, res: Response) => {
        const customerId = req.user?.userId;
        if (!customerId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        if (!isObjectId(customerId)) {
            throw new AppError(AUTH_MESSAGES.AUTH.NOT_DESIGNER, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._cutomerDashboardService.getCustomerDashboard(customerId);
        RespsonseHelper.success(res, result)
    })

}