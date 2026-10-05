import type { IActiveJobService } from "../../interfaces/customer/ICustomerService.js";
import type { Request, Response } from "express"
import { RespsonseHelper } from "../../shared/helpers/responseHelper.js"
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js"
import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError.js"
import { AUTH_MESSAGES } from "../../shared/messages/authMessages.js";
import { isObjectId } from "../../shared/helpers/extraFunctions.js";
import type {  ActiveJobsQueryParams } from "../../DTO/user/activeJobDTO.js";


// this controller contain everything related to active jobs

export class ActiveJobController {
    constructor(private _activeJobService: IActiveJobService) { }

    /**
    * for getting all active jobs
    * @route get active-job/customer
    * @param req.query {@link ActiveJobsQueryParams}
    * @throws {AppError} 400 if there is any issue with req.query
    * @throws {AppError} 401 if user is authenticated
   */
    getCustomerActiveJobs = asyncHandler(async (req: Request, res: Response) => {
        const userid = req.user?.userId;
        
        if (!userid) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        if (!isObjectId(userid)) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
   
        const result = await this._activeJobService.getCustomerActiveJobs(userid, req.query as ActiveJobsQueryParams)
        RespsonseHelper.successWithPagination(res, result)
    })
    /**
    * for getting all active jobs
    * @route get active-job/designer
    * @param req.query {@link ActiveJobsQueryParams}
    * @throws {AppError} 400 if there is any issue with req.query
    * @throws {AppError} 401 if user is authenticated
   */
    getDesignerActiveJobs = asyncHandler(async (req: Request, res: Response) => {        
        const userid = req.user?.userId;
        if (!userid) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        if (!isObjectId(userid)) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
    
        const result = await this._activeJobService.getDesignerActiveJobs(userid, req.query as ActiveJobsQueryParams)
        RespsonseHelper.successWithPagination(res, result)
    })


}