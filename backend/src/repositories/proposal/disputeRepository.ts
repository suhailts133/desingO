import type { Pagination } from "../../DTO/admin/adminDTO";
import type { DisputeAdminFilters, DisputePopulated, DisputePopulatedAll, DisputeRepoDTO, DisputeUpdateDTO } from "../../DTO/proposal/dispute";
import type { IUser } from "../../interfaces/auth/IUser";
import type { IDispute, IDisputeRepository } from "../../interfaces/proposal/IDispute";
import type { IProposal } from "../../interfaces/proposal/IProposal";
import { DisputeModel } from "../../models/proposal/disputeModal";
import { BaseRepository } from "../baseRepository";
import mongoose from "mongoose";
import type { QueryFilter, SortOrder } from "mongoose";
export class DisputeRepository extends BaseRepository<IDispute> implements IDisputeRepository {
    constructor() {
        super(DisputeModel)
    }


    async createDispute(data: DisputeRepoDTO): Promise<IDispute> {
        return this.create({
            ...data,
            proposalId: new mongoose.Types.ObjectId(data.proposalId),
            designerId: new mongoose.Types.ObjectId(data.designerId),
            customerId: new mongoose.Types.ObjectId(data.customerId),
        })
    }


    async updateDispute(id: string, data: Partial<DisputeUpdateDTO>): Promise<IDispute | null> {
        return this.update(id, data)
    }


    async getAllDispute(filters: DisputeAdminFilters): Promise<{ data: DisputePopulated[]; pagination: Pagination; }> {
        const page = filters.page ? Number(filters.page) : 1;
        const limit = 6
        const skip = (page - 1) * limit
        const sortOrder: Record<string, SortOrder> = { createdAt: -1 };
        const query: QueryFilter<IDispute> = {}

        if (filters) {
            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.sort === "asc") {
                sortOrder.createdAt = "asc"
            } else if (filters.sort === "desc") {
                sortOrder.createdAt = "desc"
            }
        }

        const [result, total] = await Promise.all([
            this._model.find(query)
                .sort(sortOrder)
                .populate<{ customerId: IUser }>("customerId")
                .populate<{ designerId: IUser }>("designerId")
                .skip(skip)
                .limit(limit)
                .exec(),
            this._model.countDocuments(query)
        ])
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        };

        return { data: result, pagination };
    }

    async findDispute(id: string): Promise<DisputePopulatedAll | null> {
        return await this._model.findById(id)
            .populate<{ customerId: IUser }>("customerId")
            .populate<{ designerId: IUser }>("designerId")
            .populate<{ proposalId: IProposal }>("proposalId")
    }

    async findDisputeByProposalId(id: string): Promise<DisputePopulatedAll | null> {
        return await this._model.findOne({ proposalId: id })
            .populate<{ customerId: IUser }>("customerId")
            .populate<{ designerId: IUser }>("designerId")
            .populate<{ proposalId: IProposal }>("proposalId")
    }
}