import type { DesignerFilterDTO, AdminDesignersResponseDTO, AdminDesignerRequestResponseDTO, AdminDesignerApprovalDTO, AdminDesignerStatusDTO } from "../../DTO/admin/adminDTO.js";
import { ensureError } from "../../helpers/ensureError.js";
import { RESPONSE_CODE } from "../../helpers/enums/statusCode.js";
import type { IAdminDesignerVerificatoinServices } from "../../interfaces/admin/IAdminService.js";
import type { IDesignerVerificationRepository } from "../../interfaces/admin/IDesignerVerificationRespository.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import { sendDesignerStatusEmail } from "../../helpers/emails/designerVerificationEmail.js";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository.js";
import { DESIGNER_STATUS, USER_ROLES } from "../../helpers/enums/commonEnums.js";

export class AdminDesignerVerificationservice implements IAdminDesignerVerificatoinServices {
    constructor(private _designerVerificationRepo: IDesignerVerificationRepository, private _userRepo: IUserRepository) { }

    async getallDesignerRequests(filter?: DesignerFilterDTO): Promise<IApiResponseWithPagination<AdminDesignersResponseDTO[]>> {
        try {
            const { data, pagination } = await this._designerVerificationRepo.getAllDesignerRequest(filter)
            return { success: true, message: "Fetched designer request forms", statuscode: RESPONSE_CODE.OK, data: data, total: pagination.total, totalPages: pagination.totalPages }
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err);
            return { success: false, message: "designer Request forms fetching Failed. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, total: 0, totalPages: 0 }
        }
    }

    async getDesignerRequest(id: string): Promise<IApiResponse<AdminDesignerRequestResponseDTO>> {
        try {
            const data = await this._designerVerificationRepo.getDesignerRequest(id);
            if (!data) {
                return { success: false, message: "Designer request form not found", statuscode: RESPONSE_CODE.NOT_FOUND }
            }
            return { success: true, message: "fetched designer request form", statuscode: RESPONSE_CODE.OK, data };
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err);
            return { success: false, message: "designer Request form fetching Failed. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
    }


    async ApproveOrRejectDesignerRequest(id: string, data: AdminDesignerApprovalDTO): Promise<IApiResponse<AdminDesignerStatusDTO>> {
        try {
            const result = await this._designerVerificationRepo.ApproveOrReject(id, data)
            if (!result) {
                return { success: false, message: "Could not approve or reject the designer request", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
            }
            if (result.status === DESIGNER_STATUS.APPROVED) {
                const statusChanged = await this._userRepo.updateUser(result.userId, { role: USER_ROLES.DESIGNER });
                if (!statusChanged) {
                    return { success: false, message: "Could not update user role to Designer - User not found", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
                }
                if (statusChanged.role !== USER_ROLES.DESIGNER) {
                    return { success: false, message: "Could not Change the Role to Desinger", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
                }
                await sendDesignerStatusEmail(result.email, result.name, result.status)
                return { success: true, message: "Approved the Designer Request Form", statuscode: RESPONSE_CODE.OK, data: { status: result.status } };
            } else {
                await sendDesignerStatusEmail(result.email, result.name, result.status, result.rejectionReason)
                return { success: true, message: "Rejected the Designer Request Form", statuscode: RESPONSE_CODE.OK, data: { status: result.status } };
            }
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err);
            return { success: false, message: "designer Approval failed. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
    }
}