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


/**
 * Service handling all workflows related to designer verification requests.
 */
export class AdminDesignerVerificationservice implements IAdminDesignerVerificatoinServices {
  constructor(private _designerVerificationRepo: IDesignerVerificationRepository, private _userRepo: IUserRepository) { }


  /**
   * Fetches a paginated list of designer verification requests.
   * 
   * @param filter - Optional filter parameters for searching and pagination.
   * @returns Paginated list of designer verification requests.
   */
  async getallDesignerRequests(filter?: DesignerFilterDTO): Promise<IApiResponseWithPagination<AdminDesignersResponseDTO[]>> {
    const { data, pagination } = await this._designerVerificationRepo.getAllDesignerRequest(filter)
    const designerData = DesignerMapper.toDesingerDtoList(data)
    return { message: ADMIN_MESSAGES.DESIGNER_VERFICATION.DESIGNER_APPLICATIONS, data: designerData, total: pagination.total, totalPages: pagination.totalPages }

  }

  /**
   * Fetches details of a single designer verification request by ID.
   * 
   * @param id - Unique identifier of the designer Application.
   * @returns Detailed application data for the specified designer.
   * @throws {AppError} 404 - If the designer request is not found.
   */
  async getDesignerRequest(id: string): Promise<IApiResponse<AdminDesignerRequestResponseDTO>> {
    const designerVerificationData = await this._designerVerificationRepo.getDesignerRequest(id);
    if (!designerVerificationData) {
      throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.DESIGNER_APPLICATION_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
    }
    const designerVerificationDetail = DesignerMapper.toDesignerDetailDto(designerVerificationData)
    return { message: ADMIN_MESSAGES.DESIGNER_VERFICATION.DESIGNER_APPLICATION_DETAIL, data: designerVerificationDetail };

  }


  /**
   * Approves or rejects a designer verification request.
   * 
   * - If **Approved**: Updates the verification status, upgrades the user role to `DESIGNER`, 
   *   and dispatches a confirmation email.
   * - If **Rejected**: Updates the verification status and sends an explanation email.
   * 
   * @param id - Unique identifier of the designer request.
   * @param data - Payload containing decision status (`APPROVED` / `REJECTED`) ,optional rejection reason , email and name.
   * @returns Updated application status.
   * @throws {AppError} 500 - If updating the request status or user role fails.
   */
  async ApproveOrRejectDesignerRequest(id: string, data: AdminDesignerApprovalDTO): Promise<IApiResponse<AdminDesignerStatusDTO>> {
    const updatedDesignerRequest = await this._designerVerificationRepo.ApproveOrReject(id, data);
    if (!updatedDesignerRequest) {
      throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.STATUS_CHAGNE_NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
    }
    const userData = DesignerMapper.toDesignerApprovalOrRejectionDTO(updatedDesignerRequest)
    if (updatedDesignerRequest.status === DESIGNER_STATUS.APPROVED) {
      const statusChanged = await this._userRepo.updateUser(userData.userId, { role: USER_ROLES.DESIGNER });
      if (!statusChanged) {
        throw new AppError(ADMIN_MESSAGES.DESIGNER_VERFICATION.STATUS_CHANGE_USER_NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
      }
    }
    await sendDesignerStatusEmail(userData.email, userData.name, userData.status, userData.rejectionReason);
    return { message: ADMIN_MESSAGES.DESIGNER_VERFICATION.STATUS_CHANGE_SUCCESS, data: { status: updatedDesignerRequest.status } };
  }
}