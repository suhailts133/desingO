import type { AdminUsersResponseDTO, AdminUserToggleStatusDTO, UserFilterDTO } from "../../DTO/admin/adminDTO";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import type { IAdminUserManagementService } from "../../interfaces/admin/IAdminService";
import type { IUserManagementRepository } from "../../interfaces/admin/IUserManagementRepository";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages";
import { UserMapper } from "../../dtoMappers/user/userMapper";

export class AdminUserManagementService implements IAdminUserManagementService {
    constructor(private _userManagement: IUserManagementRepository) { }
    async getAllUsers(filter?: UserFilterDTO): Promise<IApiResponseWithPagination<AdminUsersResponseDTO[]>> {

        const { data, pagination } = await this._userManagement.getAllUsers(filter);
        const usersData = UserMapper.toAdminUserDTOlist(data)
        return { message: ADMIN_MESSAGES.USER_MANAGEMENT.FETCH_ALL_SUCCESS, data: usersData, total: pagination.total, totalPages: pagination.totalPages };

    }

    async getAUser(id: string): Promise<IApiResponse<AdminUsersResponseDTO>> {

        const result = await this._userManagement.getUser(id);
        if (!result) {
            throw new AppError(ADMIN_MESSAGES.USER_MANAGEMENT.GET_ONE_SUCCESS, RESPONSE_CODE.NOT_FOUND)
        }
        const userData = UserMapper.toAdminUserDTO(result)
        return { message: ADMIN_MESSAGES.USER_MANAGEMENT.GET_ONE_SUCCESS, data: userData }

    }

    async toggleUser(id: string, is_blocked: boolean): Promise<IApiResponse<AdminUserToggleStatusDTO>> {

        const result = await this._userManagement.toggleUser(id, is_blocked);
        if (!result) {
            throw new AppError(ADMIN_MESSAGES.USER_MANAGEMENT.TOGGLE_ERROR, RESPONSE_CODE.INTERNAL_SERVER_ERROR)

        }
        return { message: ADMIN_MESSAGES.USER_MANAGEMENT.TOGGLE_SUCCESS, data: { is_blocked: result.is_blocked } }

    }
}