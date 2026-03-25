import type { AdminDesignerApprovalDTO, AdminDesignerApprovalRequestDTO, AdminDesignerRequestResponseDTO, AdminDesignersResponseDTO, DesignerFilterDTO, Pagination } from "../../DTO/admin/adminDTO.js";

export interface IDesignerVerificationRepository{
       getAllDesignerRequest(filter?:DesignerFilterDTO):Promise<{data:AdminDesignersResponseDTO[], pagination:Pagination}>;
       getDesignerRequest(id:string):Promise<AdminDesignerRequestResponseDTO | null>;
       ApproveOrReject(id:string, data:AdminDesignerApprovalRequestDTO):Promise<AdminDesignerApprovalDTO | null>;
       
}