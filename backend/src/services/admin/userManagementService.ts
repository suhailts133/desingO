import type { AdminUsersResponseDTO, AdminUserToggleStatusDTO, UserFilterDTO } from "../../DTO/admin/adminDTO.js";
import { MESSAGES } from "../../helpers/enums/messages.js";
import { RESPONSE_CODE } from "../../helpers/enums/statusCode.js";
import { AppError } from "../../helpers/errors/appError.js";
import type { IAdminUserManagementService } from "../../interfaces/admin/IAdminService.js";
import type { IUserManagementRepository } from "../../interfaces/admin/IUserManagementRepository.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";

export class AdminUserManagementService implements IAdminUserManagementService {
    constructor(private _userManagement: IUserManagementRepository) { }
    async getAllUsers(filter?: UserFilterDTO): Promise<IApiResponseWithPagination<AdminUsersResponseDTO[]>> {

        const { data, pagination } = await this._userManagement.getAllUsers(filter);
        return { message: MESSAGES.ADMIN_USER_MANAGEMENT.FETCH_ALL_SUCCESS, data, total: pagination.total, totalPages: pagination.totalPages };

    }

    async getAUser(id: string): Promise<IApiResponse<AdminUsersResponseDTO>> {

        const result = await this._userManagement.getUser(id);
        if (!result) {
            throw new AppError(MESSAGES.ADMIN_USER_MANAGEMENT.GET_ONE_SUCCESS, RESPONSE_CODE.NOT_FOUND)
        }
        return { message: MESSAGES.ADMIN_USER_MANAGEMENT.GET_ONE_SUCCESS, data: result }

    }

    async toggleUser(id: string, is_blocked: boolean): Promise<IApiResponse<AdminUserToggleStatusDTO>> {

        const result = await this._userManagement.toggleUser(id, is_blocked);
        if (!result) {
            throw new AppError(MESSAGES.ADMIN_USER_MANAGEMENT.TOGGLE_ERROR, RESPONSE_CODE.INTERNAL_SERVER_ERROR)

        }
        return { message: MESSAGES.ADMIN_USER_MANAGEMENT.TOGGLE_SUCCESS, data: result }

    }
}