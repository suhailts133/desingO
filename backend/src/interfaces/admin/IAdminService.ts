import type { AdminDashboardDTO } from "../../DTO/admin/adminDashboard";
import type { AdminDesignerApprovalRequestDTO, AdminDesignerRequestResponseDTO, AdminDesignersResponseDTO, AdminDesignerStatusDTO, AdminUserDetailDTO, AdminUsersResponseDTO, AdminUserToggleStatusDTO, DesignerFilterDTO, UserFilterDTO } from "../../DTO/admin/adminDTO";
import type { IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse";

export interface IAdminUserManagementService {
    getAllUsers(filter?: UserFilterDTO): Promise<IApiResponseWithPagination<AdminUsersResponseDTO[]>>
    getAUser(id: string): Promise<IApiResponse<AdminUserDetailDTO>>
    toggleUser(id: string, is_blocked: boolean): Promise<IApiResponse<AdminUserToggleStatusDTO>>
}




export interface IAdminDesignerVerificatoinServices {
    getallDesignerRequests(filter?: DesignerFilterDTO): Promise<IApiResponseWithPagination<AdminDesignersResponseDTO[]>>
    getDesignerRequest(id: string): Promise<IApiResponse<AdminDesignerRequestResponseDTO>>
    ApproveOrRejectDesignerRequest(id: string, data: AdminDesignerApprovalRequestDTO): Promise<IApiResponse<AdminDesignerStatusDTO>>
}



export interface IAdminDashboardService {
    getAdminDashBoard(): Promise<IApiResponse<AdminDashboardDTO>>
}