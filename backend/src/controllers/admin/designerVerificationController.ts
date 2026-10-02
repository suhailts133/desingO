import type { DesignerFilterDTO, AdminDesignerApprovalRequestDTO } from "../../DTO/admin/adminDTO";
import type { IAdminDesignerVerificatoinServices } from "../../interfaces/admin/IAdminService";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { isObjectId } from "../../shared/helpers/extraFunctions";
import { RespsonseHelper } from "../../shared/helpers/responseHelper";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages";
import { designerStatusChangeValidator } from "../../validators/admin/designerStatusChangeValidator";
import asyncHandler from "express-async-handler";
import type { Request, Response } from "express"
import Logger from "../../config/logger";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";

/**
 * Handle all admin designer verificaion related Routes
 */
export class DesingerVerificationController {
    constructor(private _adminDesignerVerificationServices: IAdminDesignerVerificatoinServices) { }


    /**
       * get all designer applications
       * @route GET /admin/designer-application
       */
    getAllDesignerApplication = asyncHandler(async (req: Request, res: Response) => {
        Logger.info(JSON.stringify(req.query))
        const result = await this._adminDesignerVerificationServices.getallDesignerRequests(req.query as DesignerFilterDTO);
        RespsonseHelper.successWithPagination(res, result);
    })

    /**
       * get a single designer application  by id
       * @route GET /admin/designer-application/:id
       * @param req.params.id - mongodb designer application id
       * @throws {AppError} 400 - If userId is missing
       */
    getDesignerApplicationDetail = asyncHandler(async (req: Request, res: Response) => {
        const applicationId = req.params.id as string;
        if (!applicationId) {
            throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.ID_NOT_PROVIDED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(applicationId)) {
            throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.ID_NOT_PROVIDED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._adminDesignerVerificationServices.getDesignerRequest(applicationId);
        RespsonseHelper.success(res, result);
    })

    /**
     * approve or reject designer application
     * @route PATCH /admin/designer-application/status/:id
     * @param req.params.id - designer application id
     * @param req.body {@link AdminDesignerApprovalRequestDTO}
     * @throws {AppError} 400 if there is any issue with the req.body or req.parms.id
     */
    acceptOrRejectDesignerApplication = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = designerStatusChangeValidator.validate(req.body)
        if (error) {
            const err = error.details[0]?.message || "Missing fields or Invalid Data"
            RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
      }
      const userid = req.user?.userId
      if (!userid) {
        throw new AppError(AUTH_MESSAGES.AUTH.NOT_ADMIN, RESPONSE_CODE.UNAUTHORIZED)
      }
        const validatedData = value as AdminDesignerApprovalRequestDTO
        const applicationId = req.params.id as string;
        if (!applicationId) {
            throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.ID_NOT_PROVIDED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(applicationId)) {
            throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.ID_NOT_PROVIDED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._adminDesignerVerificationServices.ApproveOrRejectDesignerRequest(userid,applicationId, validatedData)
        RespsonseHelper.success(res, result);
    })
}
