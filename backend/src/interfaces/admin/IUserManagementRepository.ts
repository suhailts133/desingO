import type { AdminUsersResponseDTO, UserFilterDTO,Pagination, AdminUserToggleStatusDTO } from "../../DTO/admin/adminDTO.js";


export interface IUserManagementRepository{
    getAllUsers(filter?:UserFilterDTO):Promise<{data: AdminUsersResponseDTO[], pagination:Pagination}>
    getUser(id:string):Promise<AdminUsersResponseDTO | null>
    toggleUser(id:string, is_blocked:boolean):Promise<AdminUserToggleStatusDTO | null>

}