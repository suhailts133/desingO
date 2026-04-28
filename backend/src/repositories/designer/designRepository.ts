import mongoose, { type SortOrder } from "mongoose";
import type { createDesignDTO, DesignDetailResponseDTO, DesignFilter, EditDesignRepoData, GetAllDesignCommonResponseDTO } from "../../DTO/designer/designDTO.js";
import type { IDesign } from "../../interfaces/designer/IDesigner.js";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository.js";
import { DesignModel } from "../../models/designer/designModel.js";
import { BaseRepository } from "../baseRepository.js";
import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { getAllDesignsResponseDTO } from "../../DTO/designer/designDTO.js";
import type { IUser } from "../../interfaces/auth/IUser.js";
import type { QueryFilter } from "mongoose"
import type { ImageUploadResult } from "../../interfaces/base/IImageUpload.js";

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

    async getDesign(id: string): Promise<IDesign | null> {
        const result = await this.findById(id);
        return result
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

    async getAllDesigns(userId: string, page?: string): Promise<{ data: getAllDesignsResponseDTO[], pagination: Pagination }> {
        const pageNO = page ? Number(page) : 1;
        const limit = 6

        const result = await this._model.find({ userId })
            .skip((pageNO - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec()
        const total = await this._model.countDocuments({ userId })
        const output: getAllDesignsResponseDTO[] = result.map(data => {
            return {
                id: data.id,
                name: data.name,
                coverImage: data.coverImage.path,
                description: data.description,
                price: data.startingPrice
            }
        })
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        }
        return {
            data: output,
            pagination
        }
    }

    async getDesignDetail(designId: string): Promise<DesignDetailResponseDTO | null> {
        const result = await this._model.findById(designId)
            .populate<{ userId: IUser }>("userId")
            .exec()
        if (!result) {
            return null
        }

        return {
            id: result.id,
            designerName: result.userId.full_name,
            designName: result.name,
            propertyType: result.propertyType,
            spaceType: result.spaceType,
            startingPrice: result.startingPrice,
            services: result.services,
            description: result.description,
            designStyles: result.designStyles,
            coverImage: result.coverImage,
            gallery: result.gallery,
            createdAt: result.createdAt.toDateString()
        }
    }

    async getAllDesignCommon(designFilter?: DesignFilter): Promise<{ data: GetAllDesignCommonResponseDTO[]; pagination: Pagination; }> {
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
        const output: GetAllDesignCommonResponseDTO[] = result.map(data => {
            return {
                id: data.id,
                name: data.name,
                spaceType: data.spaceType,
                designStyles: data.designStyles,
                coverImage: data.coverImage.path,
                budget: data.startingPrice,
                designerName: data.userId.full_name
            }
        })

        return { data: output, pagination }
    }

    async deleteADesign(id: string): Promise<boolean> {
        return await this.delete(id);
    }

}