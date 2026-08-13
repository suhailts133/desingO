import type { AdminUsersResponseDTO, AdminUserToggleStatusDTO, UserFilterDTO } from "../../DTO/admin/adminDTO";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import type { IAdminUserManagementService } from "../../interfaces/admin/IAdminService";
import type { IUserManagementRepository } from "../../interfaces/admin/IUserManagementRepository";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages";
import { UserMapper } from "../../dtoMappers/user/userMapper";



/**
 * Service handling user management tasks at the admin level.
 * 
 * Provides capabilities to view paginated user lists, retrieve specific user 
 * details, and update user access states (e.g., block/unblock).
 */
export class AdminUserManagementService implements IAdminUserManagementService {
    constructor(private _userManagement: IUserManagementRepository) { }


    /**
     * Fetches a paginated list of all users based on optional search or filter criteria.
     * 
     * @param filter - Optional query parameters for pagination, sorting, or filtering.
     * @returns Paginated response containing a list of mapped user DTOs.
     */
    async getAllUsers(filter?: UserFilterDTO): Promise<IApiResponseWithPagination<AdminUsersResponseDTO[]>> {
        const { data, pagination } = await this._userManagement.getAllUsers(filter);
        const usersData = UserMapper.toAdminUserDTOlist(data)
        return { message: ADMIN_MESSAGES.USER_MANAGEMENT.FETCH_ALL_SUCCESS, data: usersData, total: pagination.total, totalPages: pagination.totalPages };
    }


    /**
     * Retrieves details for a single user by their unique ID.
     * 
     * @param id - Unique identifier of the user.
     * @returns Response payload containing mapped user details.
     * @throws {AppError} 404 - If no user is found with the given ID.
     */
    async getAUser(id: string): Promise<IApiResponse<AdminUsersResponseDTO>> {
        const result = await this._userManagement.getUser(id);
        if (!result) {
            throw new AppError(ADMIN_MESSAGES.USER_MANAGEMENT.GET_ONE_SUCCESS, RESPONSE_CODE.NOT_FOUND)
        }
        const userData = UserMapper.toAdminUserDTO(result)
        return { message: ADMIN_MESSAGES.USER_MANAGEMENT.GET_ONE_SUCCESS, data: userData }
    }


    /**
     * Toggles a user's account status (e.g., blocking or unblocking access).
     * 
     * @param id - Unique identifier of the user to update.
     * @param is_blocked - Target block state (`true` to block, `false` to unblock).
     * @returns the new Status of the user.
     * @throws {AppError} 500 - If updating the user's status fails in the repository.
     */
    async toggleUser(id: string, is_blocked: boolean): Promise<IApiResponse<AdminUserToggleStatusDTO>> {
        const result = await this._userManagement.toggleUser(id, is_blocked);
        if (!result) {
            throw new AppError(ADMIN_MESSAGES.USER_MANAGEMENT.TOGGLE_ERROR, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: ADMIN_MESSAGES.USER_MANAGEMENT.TOGGLE_SUCCESS, data: { is_blocked: result.is_blocked } }
    }
}