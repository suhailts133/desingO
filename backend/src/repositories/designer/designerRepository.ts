import mongoose, { type QueryFilter } from "mongoose";
import type { DesignerVerificationDTO } from "../../DTO/designer/designerVerificationDTOs";
import type { IDesigner, IDesignerPopulated } from "../../interfaces/designer/IDesigner";
import type { IDesignerRepository } from "../../interfaces/designer/IDesignerRepository";
import { DesignerModel } from "../../models/designer/designerModel";
import { BaseRepository } from "../baseRepository";
import type { DesignerUpdateRequestDTO } from "../../DTO/profile/profileDTO";
import type { Pagination } from "../../DTO/admin/adminDTO";
import type { DesignerFilter } from "../../DTO/designer/designerDTO";
import { UserModel } from "../../models/user/userModel";
import type { IUser } from "../../interfaces/auth/IUser";

export class DesignerRepository extends BaseRepository<IDesigner> implements IDesignerRepository {
    constructor() {
        super(DesignerModel)
    }

    async createDesignerRequest(data: DesignerVerificationDTO): Promise<boolean> {
        const result = await this.create({
            ...data,
            userId: new mongoose.Types.ObjectId(data.userId)
        });
        return !!result
    }


    async getDesigner(userId: string): Promise<IDesigner | null> {
        const result = await this.findOne({ userId });
        if (!result) {
            return null
        }
       
        return result
    }

    async updateDesigner(designerId: string, data: DesignerUpdateRequestDTO): Promise<IDesigner | null> {
      
        const result = await this.updateOne({ userId: designerId }, data);

        return result ?? null
    }

    async getAllDesigners(designerFilter: DesignerFilter): Promise<{ data: IDesignerPopulated[], pagination: Pagination, }> {
        const PageNo = designerFilter.page ? Number(designerFilter.page) : 1;
        const limit = 1;
        const skip = (PageNo - 1) * limit
        const query: QueryFilter<IDesigner> = {}
        if (designerFilter) {
            if (designerFilter.full_name) {
                const matchingUsers = await UserModel.find({
                    full_name: { $regex: designerFilter.full_name, $options: "i" }
                }).select("_id")
                const userIds = matchingUsers.map(u => u._id)
                query.userId = { $in: userIds }
            }
        }
        const [designers, total] = await Promise.all([
            this._model.find(query)
                .populate<{ userId: IUser }>("userId")
                .skip(skip)
                .limit(limit)
                .exec(),

            this._model.countDocuments(query)
        ])
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        }

        return { data:designers, pagination }
    }
}