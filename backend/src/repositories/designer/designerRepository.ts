import mongoose, { type QueryFilter } from "mongoose";
import type { DesignerVerificationDTO } from "../../DTO/designer/designerVerificationDTOs.js";
import type { IDesigner } from "../../interfaces/designer/IDesigner.js";
import type { IDesignerRepository } from "../../interfaces/designer/IDesignerRepository.js";
import { DesignerModel } from "../../models/designer/designerModel.js";
import { BaseRepository } from "../baseRepository.js";
import type { DesignerUpdateRequestDTO } from "../../DTO/profile/profileDTO.js";
import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { DesignFilter } from "../../DTO/designer/designDTO.js";
import type { DesignerCardDTO, DesignerFilter } from "../../DTO/designer/designerDTO.js";
import { UserModel } from "../../models/user/userModel.js";
import type { IUser } from "../../interfaces/auth/IUser.js";

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
        console.log(designerId, "from repo")
        console.log(data, "from repo data")
        const result = await this.updateOne({ userId: designerId }, data);

        return result ?? null
    }

    async getAllDesigners(designerFilter: DesignerFilter): Promise<{ data: DesignerCardDTO[], pagination: Pagination, }> {
        const PageNo = designerFilter.page ? Number(designerFilter.page) : 1;
        const limit = 6;
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
        const data: DesignerCardDTO[] = designers.map(d => {
            return {
                designerId: d.id,
                full_name: d.userId.full_name,
                ...(d.userId.profileImage?.path && { profileImg: d.userId.profileImage.path }),
                ...(d.userId.profile_image_url && { google_profil_img: d.userId.profile_image_url }),
                bio: d.bio,
                joinedAt: d.createdAt.toDateString()
            }
        })
        return { data, pagination }
    }
}