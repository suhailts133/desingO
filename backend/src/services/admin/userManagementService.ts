import type { AdminUsersResponseDTO, AdminUserToggleStatusDTO, UserFilterDTO } from "../../DTO/admin/adminDTO.js";
import { ensureError } from "../../helpers/errors/ensureError.js";
import { RESPONSE_CODE } from "../../helpers/enums/statusCode.js";
import type { IAdminUserManagementService } from "../../interfaces/admin/IAdminService.js";
import type { IUserManagementRepository } from "../../interfaces/admin/IUserManagementRepository.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";

export class AdminUserManagementService implements IAdminUserManagementService {
    constructor(private _userManagement: IUserManagementRepository) { }
    async getAllUsers(filter?: UserFilterDTO): Promise<IApiResponseWithPagination<AdminUsersResponseDTO[]>> {
        try {
            const { data, pagination } = await this._userManagement.getAllUsers(filter);
            return { success: true, message: "Users Fetched", statuscode: RESPONSE_CODE.OK, data, total: pagination.total, totalPages: pagination.totalPages };
        } catch (error) {
            const err = ensureError(error);
            console.error(err.message);
            return { success: false, message: "Users Data Fetching Failed. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, totalPages: 0, total: 0 };
        }
    }

    async getAUser(id: string): Promise<IApiResponse<AdminUsersResponseDTO>> {
        try {
            const result = await this._userManagement.getUser(id);
            if (!result) {
                return { success: false, message: "User Not Found", statuscode: RESPONSE_CODE.NOT_FOUND }
            }
            return { success: true, message: "User Found", statuscode: RESPONSE_CODE.OK, data: result }
        } catch (error) {
            const err = ensureError(error)
            console.error(err.message);
            return { success: false, message: "User data fetching failed. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
    }

    async toggleUser(id: string, is_blocked: boolean): Promise<IApiResponse<AdminUserToggleStatusDTO>> {
        try {
            const result = await this._userManagement.toggleUser(id, is_blocked);
            if (!result) {
                return { success: false, message: "User Not Found", statuscode: RESPONSE_CODE.NOT_FOUND }
            }
            return { success: true, message: "Toggling Success", statuscode: RESPONSE_CODE.OK, data: result }
        } catch (error) {
            const err = ensureError(error)
            console.error(err.message);
            return { success: false, message: "Toggling failed. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
    }
}