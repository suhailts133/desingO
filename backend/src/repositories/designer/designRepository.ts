import mongoose, { type SortOrder } from "mongoose";
import type { createDesignDTO, DesignFilter, EditDesignRepoData } from "../../DTO/designer/designDTO.js";
import type { IDesign, IDesignPopulated } from "../../interfaces/designer/IDesigner.js";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository.js";
import { DesignModel } from "../../models/designer/designModel.js";
import { BaseRepository } from "../baseRepository.js";
import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { IUser } from "../../interfaces/auth/IUser.js";
import type { QueryFilter } from "mongoose"
import type { ImageUploadResult } from "../../interfaces/base/IImageUpload.js";
import type { SpaceTypeAvg } from "../../interfaces/benchmark/IBenchMark.js";

export class DesignRepository extends BaseRepository<IDesign> implements IDesignRepository {
    constructor() {
        super(DesignModel)
    }

    async createDesign(data: createDesignDTO): Promise<boolean> {
        const result = await this.create({
            ...data,
            userId: new mongoose.Types.ObjectId(data.userId)
        });
        return !!result
    }

    async editDesign(id: string, data: EditDesignRepoData, coverImage?: ImageUploadResult, gallery?: ImageUploadResult[]): Promise<boolean> {
        const updateData = {
            ...data,
            ...(coverImage && { coverImage }),
            ...(gallery && { gallery }),
        }
        const result = await this.update(id, { $set: updateData })
        return !!result
    }

    async getMyDesigns(userId: string, page?: string): Promise<{ data: IDesign[], pagination: Pagination }> {
        const pageNO = page ? Number(page) : 1;
        const limit = 6

        const result = await this._model.find({ userId })
            .skip((pageNO - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec()
        const total = await this._model.countDocuments({ userId })
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        }
        return {
            data: result,
            pagination
        }
    }

    async getDesign(designId: string): Promise<IDesignPopulated | null> {
        const result = await this._model.findById(designId)
            .populate<{ userId: IUser }>("userId")
            .exec()
        if (!result) {
            return null
        }
        return result


    }

    async getAllDesigns(designFilter?: DesignFilter): Promise<{ data: IDesignPopulated[]; pagination: Pagination; }> {
        const page = designFilter?.page ? Number(designFilter?.page) : 1;
        const limit = 9;
        const query: QueryFilter<IDesign> = {}
        if (designFilter) {
            if (designFilter.designStyles) {
                query.designStyles = { $in: designFilter.designStyles.split(",") }
            }
            if (designFilter.propertyTypes) {
                query.propertyType = { $in: designFilter.propertyTypes.split(",") }
            }
            if (designFilter.spaceTypes) {
                query.spaceType = { $in: designFilter.spaceTypes.split(",") }
            }
        }

        let sortOrder: { [key: string]: SortOrder } = { createdAt: 1 };
        if (designFilter?.sortBy) {
            if (designFilter.sortBy === "price_asc") {
                sortOrder = { startingPrice: 1 }
            }
            if (designFilter.sortBy === "price_desc") {
                sortOrder = { startingPrice: -1 }
            }
            if (designFilter.sortBy === "az") {
                sortOrder = { name: 1 }
            }
            if (designFilter.sortBy === "za") {
                sortOrder = { name: -1 }
            }

        }
        const result = await this._model.find(query)
            .populate<{ userId: IUser }>("userId")
            .sort(sortOrder)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec()

        const total = await this._model.countDocuments(query)
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        }
        return { data: result, pagination }
    }

    async deleteADesign(id: string): Promise<boolean> {
        return await this.delete(id);
    }

    async computeAvgPriceBySpaceType(): Promise<SpaceTypeAvg[]> {
        const result = await this._model.aggregate([
            {
                $group: {
                    _id: "$spaceType",
                    averageMinPrice: { $avg: "$minPrice" },
                    averageMaxPrice: { $avg: "$maxPrice" },
                    noOfDesigns: { $sum: 1 },
                }
            },
            {
                $project: {
                    _id: 0,
                    spaceType: "$_id",
                    averageMinPrice: 1,
                    averageMaxPrice: 1,
                    noOfDesigns: 1,
                }
            }
        ]);

        return result;
    }

}