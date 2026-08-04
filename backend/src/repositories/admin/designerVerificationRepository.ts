import type { DesignerFilterDTO, AdminDesignerApprovalRequestDTO, Pagination } from "../../DTO/admin/adminDTO";
import type { IDesignerVerificationRepository } from "../../interfaces/admin/IDesignerVerificationRespository";
import type { IUser } from "../../interfaces/auth/IUser";
import type { IDesigner, IDesignerPopulated } from "../../interfaces/designer/IDesigner";
import { DesignerModel } from "../../models/designer/designerModel";
import { UserModel } from "../../models/user/userModel";
import { BaseRepository } from "../baseRepository";
import type { QueryFilter } from "mongoose";

export class DesignerVerificationManagementRepository extends BaseRepository<IDesigner> implements IDesignerVerificationRepository {
    constructor() {
        super(DesignerModel)
    }

    async getAllDesignerRequest(filter?: DesignerFilterDTO): Promise<{ data: IDesignerPopulated[], pagination: Pagination }> {
        const page = filter?.page ? Number(filter.page) : 1;
        const limit = 10;
        const query: QueryFilter<DesignerFilterDTO> = {}
        if (filter) {
            if (filter.name) {
                const matchingUsers = await UserModel.find({ full_name: { $regex: filter.name, $options: "i" } })
                const userIds = matchingUsers.map(u => u._id);
                query.userId = { $in: userIds }
            }
            if (filter.status) {
                query.status = filter.status
            }
        }

        const result = await this._model.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate<{ userId: IUser }>("userId")
            .exec()
        const total = await this._model.countDocuments(query)

        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        }
        return {
            data: result,
            pagination
        }
    }

    async getDesignerRequest(id: string): Promise<IDesignerPopulated | null> {
        const result = await this._model.findById(id).populate<{ userId: IUser }>("userId").exec()

        if (!result) {
            return null
        }

        return result
    }

    async ApproveOrReject(id: string, data: AdminDesignerApprovalRequestDTO): Promise<IDesignerPopulated | null> {
        const result = await this._model.findByIdAndUpdate(id, data, { returnDocument: "after" }).populate<{ userId: IUser }>("userId").exec();
        if (!result) {
            return null
        }
        return result
    }
}
