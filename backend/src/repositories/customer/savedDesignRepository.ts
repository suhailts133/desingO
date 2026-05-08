import type { Types } from "mongoose";
import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { ISavedDesignRepository } from "../../interfaces/customer/ISavedDesign.js";
import type { IDesign, IDesignPopulated } from "../../interfaces/designer/IDesigner.js";
import { DesignModel } from "../../models/designer/designModel.js";
import { BaseRepository } from "../baseRepository.js";
import type { IUser } from "../../interfaces/auth/IUser.js";

export class SavedDesignRepository extends BaseRepository<IDesign> implements ISavedDesignRepository {
    constructor() {
        super(DesignModel)
    }

    async getSavedDesigns(designArr: Types.ObjectId[], pageNo?: string): Promise<{ data: IDesignPopulated[]; pagination: Pagination }> {
        const page = pageNo ? Number(pageNo) : 1;
        const limit = 9;
        const query = { _id: { $in: designArr } };

        const [result, total] = await Promise.all([
            this._model.find(query)
                .populate<{ userId: IUser }>("userId")
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this._model.countDocuments(query)
        ]);

        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        };

        return { data: result, pagination };
    }
}