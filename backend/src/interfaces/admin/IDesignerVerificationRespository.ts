import type {  AdminDesignerApprovalRequestDTO, DesignerFilterDTO, Pagination } from "../../DTO/admin/adminDTO.js";
import type { IDesignerPopulated } from "../designer/IDesigner.js";

export interface IDesignerVerificationRepository{
       getAllDesignerRequest(filter?:DesignerFilterDTO):Promise<{data:IDesignerPopulated[], pagination:Pagination}>;
       getDesignerRequest(id:string):Promise<IDesignerPopulated | null>;
       ApproveOrReject(id:string, data:AdminDesignerApprovalRequestDTO):Promise<IDesignerPopulated | null>;
       
}