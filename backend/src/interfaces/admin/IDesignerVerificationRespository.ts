import type { Types } from "mongoose";
import type { AdminDesignerApprovalRequestDTO, DesignerFilterDTO, Pagination } from "../../DTO/admin/adminDTO";
import type { IUser } from "../auth/IUser";
import type { IDesignerPopulated } from "../designer/IDesigner";

export interface IDesignerVerificationRepository {
       getAllDesignerRequest(filter?: DesignerFilterDTO): Promise<{ data: IDesignerPopulated[], pagination: Pagination }>;
       getDesignerRequest(id: string): Promise<IDesignerPopulated | null>;
       ApproveOrReject(id: string, data: AdminDesignerApprovalRequestDTO): Promise<IDesignerPopulated | null>;

}


export type IDesignerAggregateResult = Omit<IDesignerPopulated, 'id' | 'userId'> & {
       _id: Types.ObjectId;
       userId: IUser;
};

export interface IFacetQueryResult {
       data: IDesignerAggregateResult[];
       totalCount: Array<{ count: number }>;
}