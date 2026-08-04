import type {   Pagination, UserFilterDTO } from "../../DTO/admin/adminDTO";
import type { IUserManagementRepository } from "../../interfaces/admin/IUserManagementRepository";
import type { IUser } from "../../interfaces/auth/IUser";
import { UserModel } from "../../models/user/userModel";
import { USER_ROLES } from "../../shared/enums/commonEnums";
import { BaseRepository } from "../baseRepository";
import type { QueryFilter } from "mongoose"
export class UserManagementRepository extends BaseRepository<IUser> implements IUserManagementRepository {
    constructor() {
        super(UserModel);
    }


    async getUser(id: string): Promise<IUser | null> {
        const result = await this.findById(id);
        if (!result) return null;
        return result
    }

    async toggleUser(id: string, is_blocked: boolean): Promise<IUser | null> {
        const result = await this.update(id, { is_blocked })
        if (!result) {
            return null
        }

        return result
    }

    async getAllUsers(filter?: UserFilterDTO): Promise<{ data: IUser[]; pagination: Pagination; }> {
        const page = filter?.page ? Number(filter.page) : 1;
        const limit = 10;

        const query: QueryFilter<IUser> = {};
        query.role = { "$ne": USER_ROLES.ADMIN };
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
 
        const result = await this.find(query, { skip: (page - 1) * limit, limit });
        const total = await this._model.countDocuments(query);


        const pagination:Pagination={
            total,
            totalPages:Math.ceil(total/limit)
        }
        return {
            data:result,
            pagination
        }
    }



}