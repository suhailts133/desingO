import { ensureError } from "../helpers/ensureError.js";
import type { IAdminDesignerVerificatoinServices, IAdminUserManagementService } from "../interfaces/admin/IAdminService.js";
import type { Request, Response } from "express";
import { RespsonseHelper } from "../helpers/responseHelper.js";
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js";
import { designerStatusChangeValidator } from "../validators/admin/designerStatusChangeValidator.js";
import type {  AdminDesignerApprovalRequestDTO, DesignerFilterDTO, UserFilterDTO } from "../DTO/admin/adminDTO.js";


export class AdminController {
    constructor(
        private _adminuserManagementServices: IAdminUserManagementService,
        private _adminDesignerVerificationServices: IAdminDesignerVerificatoinServices
    ) { }


   getUsers = async (req: Request, res: Response) => {
    try {
        const result = await this._adminuserManagementServices.getAllUsers(req.query as UserFilterDTO);
        RespsonseHelper.successWithPagination(res, result)
    } catch (error) {
        const err = ensureError(error).message;
        RespsonseHelper.error(res, "Error While fetching users", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
    }
};

    getUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            if (!id) {
                RespsonseHelper.error(res, "ID not Provided", "ID not provided", RESPONSE_CODE.BAD_REQUEST)
            }
            const result = await this._adminuserManagementServices.getAUser(id as string);
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error While fetching user Detail", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }

    toggleUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            console.log(id)
            if (!id) {
                RespsonseHelper.error(res, "ID not Provided", "ID not provided", RESPONSE_CODE.BAD_REQUEST)
            }
            const { is_blocked } = req.body
            console.log(id, is_blocked)
            const result = await this._adminuserManagementServices.toggleUser(id as string, is_blocked)
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error While toggling", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }



    getAllDesignerRequests = async (req: Request, res: Response) => {
        try {
            const result = await this._adminDesignerVerificationServices.getallDesignerRequests(req.query as DesignerFilterDTO);
            console.log("yo: ",result)
            RespsonseHelper.successWithPagination(res, result);
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While fetching designer requests", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }

    getDesignerRequest = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                RespsonseHelper.error(res, "Designer Request ID not Provided", "Designer Request ID not provided", RESPONSE_CODE.BAD_REQUEST)
            }
            const result = await this._adminDesignerVerificationServices.getDesignerRequest(id as string);
            RespsonseHelper.success(res, result);
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While fetching designer request form", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }

    acceptOrRejectDesignerRequest = async (req: Request, res: Response) => {
        try {
            const { error, value } = designerStatusChangeValidator.validate(req.body)
            if (error) {
                const err = error.details[0]?.message || "Missing fields or Invalid Data"
                RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
            }
            const validatedData = value as AdminDesignerApprovalRequestDTO
          
            const { id } = req.params;
            
            if (!id) {
                RespsonseHelper.error(res, "Designer Request ID not Provided", "Designer Request ID not provided", RESPONSE_CODE.BAD_REQUEST)
            }
            const result = await this._adminDesignerVerificationServices.ApproveOrRejectDesignerRequest(id as string, validatedData)
            RespsonseHelper.success(res, result);
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While approving or rejecting the designer request", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }
}