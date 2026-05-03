import type { DesignerFilterDTO, AdminDesignersResponseDTO, AdminDesignerRequestResponseDTO, AdminDesignerApprovalDTO, AdminDesignerStatusDTO } from "../../DTO/admin/adminDTO.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import type { IAdminDesignerVerificatoinServices } from "../../interfaces/admin/IAdminService.js";
import type { IDesignerVerificationRepository } from "../../interfaces/admin/IDesignerVerificationRespository.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import { sendDesignerStatusEmail } from "../../shared/emails/designerVerificationEmail.js";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository.js";
import { DESIGNER_STATUS, USER_ROLES } from "../../shared/enums/commonEnums.js";

import { AppError } from "../../shared/errors/appError.js";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages.js";

export class AdminDesignerVerificationservice implements IAdminDesignerVerificatoinServices {
    constructor(private _designerVerificationRepo: IDesignerVerificationRepository, private _userRepo: IUserRepository) { }

    async getallDesignerRequests(filter?: DesignerFilterDTO): Promise<IApiResponseWithPagination<AdminDesignersResponseDTO[]>> {
        const { data, pagination } = await this._designerVerificationRepo.getAllDesignerRequest(filter)
        return { message: ADMIN_MESSAGES.DESIGNER_VERFICATION.DESIGNER_APPLICATIONS, data: data, total: pagination.total, totalPages: pagination.totalPages }

    }

    async getDesignerRequest(id: string): Promise<IApiResponse<AdminDesignerRequestResponseDTO>> {
        const data = await this._designerVerificationRepo.getDesignerRequest(id);
        if (!data) {
            throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.DESIGNER_APPLICATION_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        return { message: ADMIN_MESSAGES.DESIGNER_VERFICATION.DESIGNER_APPLICATION_DETAIL, data };

    }


    async ApproveOrRejectDesignerRequest(id: string, data: AdminDesignerApprovalDTO): Promise<IApiResponse<AdminDesignerStatusDTO>> {
        const result = await this._designerVerificationRepo.ApproveOrReject(id, data)
        if (!result) {
            throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.STATUS_CHAGNE_NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)

        }
        if (result.status === DESIGNER_STATUS.APPROVED) {
            const statusChanged = await this._userRepo.updateUser(result.userId, { role: USER_ROLES.DESIGNER });
            if (!statusChanged) {
                throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.STATUS_CHANGE_USER_NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)

            }
            if (statusChanged.role !== USER_ROLES.DESIGNER) {
                throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.STATUS_CHANGE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
            }
            await sendDesignerStatusEmail(result.email, result.name, result.status)
            return { message: ADMIN_MESSAGES.DESIGNER_VERFICATION.STATUS_CHANGE_SUCCESS, data: { status: result.status } };
        } else {
            await sendDesignerStatusEmail(result.email, result.name, result.status, result.rejectionReason)
            return { message: ADMIN_MESSAGES.DESIGNER_VERFICATION.STATUS_CHANGE_SUCCESS, data: { status: result.status } };
        }
    }
}