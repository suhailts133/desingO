import type { IAdminUserManagementService } from "../../interfaces/admin/IAdminService";
import type { Request, Response } from "express";
import { RespsonseHelper } from "../../shared/helpers/responseHelper";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import type { UserFilterDTO } from "../../DTO/admin/adminDTO";
import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages";
import { isObjectId } from "../../shared/helpers/extraFunctions";


/**
 * Handle all admin user Management related Routes
 */
export class UserController {
    constructor(private _adminuserManagementServices: IAdminUserManagementService,) { }


    /**
     * get all users data
     * @route GET /admin/users
     */
    getUsers = asyncHandler(async (req: Request, res: Response) => {
        const result = await this._adminuserManagementServices.getAllUsers(req.query as UserFilterDTO);
        RespsonseHelper.successWithPagination(res, result)
    })


    /**
        * get a single user data by id
        * @route GET /admin/users/:id
        * @param req.params.id - mongodb userid
        * @throws {AppError} 400 - If userId is missing
        */
    getUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.id as string;
        if (!userId) {
            throw new AppError(ADMIN_MESSAGES.USER_MANAGEMENT.ID_NOT_PROVIDED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(userId)) {
            throw new AppError(ADMIN_MESSAGES.USER_MANAGEMENT.ID_NOT_PROVIDED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._adminuserManagementServices.getAUser(userId);
        RespsonseHelper.success(res, result)
    })

    /**
    * toggle user status - block/unblock
    * @route PATCH /admin/toggle-status/:id
    * @param req.params.id - mongodb userid
    * @param req.body.is_blocked - users status to update
    * @throws {AppError} 400 - If userId is missing
    */
    toggleUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.id as string;
        if (!userId) {
            throw new AppError(ADMIN_MESSAGES.USER_MANAGEMENT.ID_NOT_PROVIDED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(userId)) {
            throw new AppError(ADMIN_MESSAGES.USER_MANAGEMENT.ID_NOT_PROVIDED, RESPONSE_CODE.BAD_REQUEST)
        }
        const { is_blocked } = req.body
        const result = await this._adminuserManagementServices.toggleUser(userId, is_blocked)
        RespsonseHelper.success(res, result)
    })
}