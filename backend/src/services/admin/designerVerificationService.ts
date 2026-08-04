import type { DesignerFilterDTO, AdminDesignersResponseDTO, AdminDesignerRequestResponseDTO, AdminDesignerApprovalDTO, AdminDesignerStatusDTO } from "../../DTO/admin/adminDTO";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import type { IAdminDesignerVerificatoinServices } from "../../interfaces/admin/IAdminService";
import type { IDesignerVerificationRepository } from "../../interfaces/admin/IDesignerVerificationRespository";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse";
import { sendDesignerStatusEmail } from "../../shared/emails/designerVerificationEmail";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import { DESIGNER_STATUS, USER_ROLES } from "../../shared/enums/commonEnums";
import { AppError } from "../../shared/errors/appError";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages";
import { DesignerMapper } from "../../dtoMappers/designer/designerMapper";


export class AdminDesignerVerificationservice implements IAdminDesignerVerificatoinServices {
  constructor(private _designerVerificationRepo: IDesignerVerificationRepository, private _userRepo: IUserRepository) { }

  async getallDesignerRequests(filter?: DesignerFilterDTO): Promise<IApiResponseWithPagination<AdminDesignersResponseDTO[]>> {
    const { data, pagination } = await this._designerVerificationRepo.getAllDesignerRequest(filter)
    const designerData = DesignerMapper.toDesingerDtoList(data)
    return { message: ADMIN_MESSAGES.DESIGNER_VERFICATION.DESIGNER_APPLICATIONS, data: designerData, total: pagination.total, totalPages: pagination.totalPages }

  }

  async getDesignerRequest(id: string): Promise<IApiResponse<AdminDesignerRequestResponseDTO>> {
    const data = await this._designerVerificationRepo.getDesignerRequest(id);
    if (!data) {
      throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.DESIGNER_APPLICATION_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
    }
    const designerDetail = DesignerMapper.toDesignerDetailDto(data)
    return { message: ADMIN_MESSAGES.DESIGNER_VERFICATION.DESIGNER_APPLICATION_DETAIL, data: designerDetail };

  }


  async ApproveOrRejectDesignerRequest(id: string, data: AdminDesignerApprovalDTO): Promise<IApiResponse<AdminDesignerStatusDTO>> {
    const result = await this._designerVerificationRepo.ApproveOrReject(id, data);
    if (!result) {
      throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.STATUS_CHAGNE_NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
    }
    const userData = DesignerMapper.toDesignerApprovalOrRejectionDTO(result)
    if (result.status === DESIGNER_STATUS.APPROVED) {
      const statusChanged = await this._userRepo.updateUser(userData.userId, { role: USER_ROLES.DESIGNER });
      if (!statusChanged) {
        throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.STATUS_CHANGE_USER_NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
      }
    }
    await sendDesignerStatusEmail(userData.email, userData.name, userData.status, userData.rejectionReason);
    return { message: ADMIN_MESSAGES.DESIGNER_VERFICATION.STATUS_CHANGE_SUCCESS, data: { status: result.status } };
  }
}