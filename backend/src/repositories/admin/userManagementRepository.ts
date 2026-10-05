import type { Pagination, UserFilterDTO } from "../../DTO/admin/adminDTO";
import type { IUserManagementRepository } from "../../interfaces/admin/IUserManagementRepository";
import type { IUser, UserRole } from "../../interfaces/auth/IUser";
import type { sortByTypes } from "../../interfaces/base/IApiResponse";
import { UserModel } from "../../models/user/userModel";
import { USER_ROLES } from "../../shared/enums/commonEnums";
import { toCleanRegExp, validateDate } from "../../shared/helpers/extraFunctions";
import { BaseRepository } from "../baseRepository";
import type { QueryFilter } from "mongoose";
export class UserManagementRepository extends BaseRepository<IUser> implements IUserManagementRepository {
  constructor() {
    super(UserModel);
  }

  async getUser(id: string): Promise<IUser | null> {
    const result = await this.findById(id);
    if (!result) return null;
    return result;
  }

  async toggleUser(id: string, is_blocked: boolean): Promise<IUser | null> {
    const result = await this.update(id, { is_blocked });
    if (!result) {
      return null;
    }

    return result;
  }

  async getAllUsers(filter?: UserFilterDTO): Promise<{ data: IUser[]; pagination: Pagination }> {
    const page = filter?.page ? Number(filter.page) : 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const SORT_MAP: Record<sortByTypes, Record<string, 1 | -1>> = {
      newest: { createdAt: -1, _id: -1 },
      oldest: { createdAt: 1, _id: 1 },
      name_asc: { full_name: 1, _id: 1 },
      name_desc: { full_name: -1, _id: -1 },
    };

    const sort = SORT_MAP[filter?.sortBy as sortByTypes] ?? SORT_MAP.newest;
    const query: QueryFilter<IUser> = {};
    query.role = { $ne: USER_ROLES.ADMIN };
    if (filter) {
      if (filter.debouncedName) {
        query.full_name = toCleanRegExp(filter.debouncedName);
      }
      if (filter.is_blocked !== undefined) {
        query.is_blocked = filter.is_blocked === "true";
      }
      if (filter.role) {
        query.role = filter.role as UserRole;
      }
      const start = validateDate(filter.startDate, "startDate");
      const end = validateDate(filter.endDate, "endDate");
      if (start || end) {
        query.createdAt = {
          ...(start && { $gte: start }),
          ...(end && { $lte: end }),
        };
      }
    }

    const result = await this._model.find(query).sort(sort).skip(skip).limit(limit);
    const total = await this._model.countDocuments(query);

    const pagination: Pagination = {
      total,
      totalPages: Math.ceil(total / limit),
    };
    return {
      data: result,
      pagination,
    };
  }
}
