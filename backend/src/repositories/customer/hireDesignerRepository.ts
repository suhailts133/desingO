import type { QueryFilter, SortOrder } from "mongoose";
import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { CreateHireDesignerDTO, HireDesignerFilter, HireDesignerPopulatedALL, HireDesignerPopulateUser } from "../../DTO/user/hireDesignerDTO.js";
import type { IUser } from "../../interfaces/auth/IUser.js";
import type { IHireDesigner } from "../../interfaces/customer/ICustomer.js";
import type { IHireDesignerRepository } from "../../interfaces/customer/ICustomerRepository.js";
import type { IDesign } from "../../interfaces/designer/IDesigner.js";
import { HireDesignerModel } from "../../models/user/hireDesignerModel.js";
import { BaseRepository } from "../baseRepository.js";
import mongoose from "mongoose";

export class HireDesignerRepository extends BaseRepository<IHireDesigner> implements IHireDesignerRepository {
    constructor() {
        super(HireDesignerModel)
    }


    async createHireDesigner(data: CreateHireDesignerDTO): Promise<IHireDesigner> {
        const doc = {
            ...data,
            userId: new mongoose.Types.ObjectId(data.userId),
            designerId: new mongoose.Types.ObjectId(data.designerId),
            designId: new mongoose.Types.ObjectId(data.designId),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
        };
        return await this.create(doc);
    }

    async checkIfApplied(userId: string, designId: string): Promise<IHireDesigner | null> {
        return await this.findOne({ userId, designId })
    }
    async getHireDesignerByJobId(jobId:string): Promise<IHireDesigner | null> {
        return await this.findOne({ jobId })
    }
    async getHireRequestPerDesign(designId: string, filters?: HireDesignerFilter): Promise<{ data: HireDesignerPopulateUser[]; pagination: Pagination; }> {
        const page = filters?.page ? Number(filters.page) : 1;
        const limit = 6
        const skip = (page - 1) * limit;
        const query: QueryFilter<IHireDesigner> = { designId: designId };
        const sortOrder: { [key: string]: SortOrder } = { createdAt: -1 }

        if (filters) {
            if (filters.sort === "asc") {
                sortOrder.createdAt = "asc"
            } else if (filters.sort === "desc") {
                sortOrder.createdAt = "desc"
            }

            if (filters.startDate && filters.endDate) {
                query.createdAt = {
                    $gte: new Date(filters.startDate),
                    $lte: new Date(filters.endDate)
                }

            }
        }
        const [result, total] = await Promise.all([
            this._model.find(query)
                .populate<{ userId: IUser }>("userId")
                .skip(skip)
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

    async getMyHireDesignerRequests(userId: string, filters?: HireDesignerFilter): Promise<{ data: HireDesignerPopulatedALL[]; pagination: Pagination; }> {
        const page = filters?.page ? Number(filters.page) : 1;
        const limit = 6
        const skip = (page - 1) * limit;
        const query: QueryFilter<IHireDesigner> = { userId: userId };
        const sortOrder: { [key: string]: SortOrder } = { createdAt: -1 }

        if (filters) {
            if (filters.sort === "asc") {
                sortOrder.createdAt = "asc"
            } else if (filters.sort === "desc") {
                sortOrder.createdAt = "desc"
            }

            if (filters.startDate && filters.endDate) {
                query.createdAt = {
                    $gte: new Date(filters.startDate),
                    $lte: new Date(filters.endDate)
                }

            }
        }
        const [result, total] = await Promise.all([
            this._model.find(query)
                .populate<{ userId: IUser }>("userId")
                .populate<{ designId: IDesign }>("designId")
                .skip(skip)
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