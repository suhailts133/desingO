import type { AdminUsersResponseDTO, AdminUserToggleStatusDTO, Pagination, UserFilterDTO } from "../../DTO/admin/adminDTO.js";

import type { IUserManagementRepository } from "../../interfaces/admin/IUserManagementRepository.js";
import type { IUser } from "../../interfaces/auth/IUser.js";
import { UserModel } from "../../models/user/userModel.js";
import { BaseRepository } from "../baseRepository.js";
import type { QueryFilter } from "mongoose"
export class UserManagementRepository extends BaseRepository<IUser> implements IUserManagementRepository {
    constructor() {
        super(UserModel);
    }


    async getUser(id: string): Promise<AdminUsersResponseDTO | null> {
        const result = await this.findById(id);
        if (!result) return null;

        const data: AdminUsersResponseDTO = {
            id: result._id.toString(),
            full_name: result.full_name,
            email: result.email,
            role: result.role,
            is_blocked: result.is_blocked,
            joinedAt: result.createdAt.toISOString()
        };
        return data;
    }

    async toggleUser(id: string, is_blocked: boolean): Promise<AdminUserToggleStatusDTO | null> {
        const result = await this.update(id, { is_blocked })
        if (!result) {
            return null
        }
        console.log("toggle: ",result)
        return {
            is_blocked: result.is_blocked,
        }
    }

    async getAllUsers(filter?: UserFilterDTO): Promise<{ data: AdminUsersResponseDTO[]; pagination: Pagination; }> {
        const page = filter?.page ? Number(filter.page) : 1;
        const limit = 10;
        console.log("filters: ", filter)
        const query: QueryFilter<IUser> = {};
        query.role = { "$ne": "Admin" };
        if (filter) {
            if (filter.name) {
                query.full_name = { $regex: `${filter.name}`, $options: 'i' };
            }
            if (filter.is_blocked !== undefined) {
                query.is_blocked = filter.is_blocked === "true"
            }
            if (filter.role) {
                query.role = filter.role;
            }
        }
        console.log("from repo: ",query)
        const result = await this.find(query, { skip: (page - 1) * limit, limit });
        const total = await this._model.countDocuments(query);

        const data: AdminUsersResponseDTO[] = result.map(data => ({
            full_name: data.full_name,
            id: data._id.toString(),
            role: data.role,
            is_blocked: data.is_blocked,
            joinedAt: data.createdAt.toISOString(),
            email: data.email
        }));
        const pagination:Pagination={
            total,
            totalPages:Math.ceil(total/limit)
        }
        return {
            data,
            pagination
        }
    }



}