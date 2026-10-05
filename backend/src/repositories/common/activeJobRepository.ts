import mongoose, { type ClientSession, type QueryFilter } from "mongoose";
import type { ActiveJobPopulated, ActiveJobsQueryParams, CreateActiveJobDTO } from "../../DTO/user/activeJobDTO";
import type { IUser, UserRoleNoAdmin } from "../../interfaces/auth/IUser";
import type { IActiveJob } from "../../interfaces/customer/ICustomer";
import type { IActiveJobRepository } from "../../interfaces/customer/ICustomerRepository";
import { ActiveJobModel } from "../../models/user/ActiveJobModal";
import { ACTIVE_JOB_STATUS } from "../../shared/enums/commonEnums";
import { BaseRepository } from "../baseRepository";
import type { Pagination } from "../../DTO/admin/adminDTO";
import type { sortByTypes } from "../../interfaces/base/IApiResponse";
import { toCleanRegExp, validateDate } from "../../shared/helpers/extraFunctions";
import { USER_TYPE } from "../../shared/enums/proposalEnums";

export class ActiveJobRepository extends BaseRepository<IActiveJob> implements IActiveJobRepository {
  constructor() {
    super(ActiveJobModel);
  }

  async countAllActiveJob(): Promise<number> {
    return await this._model.countDocuments({ status: ACTIVE_JOB_STATUS.ACTIVE });
  }

  async countDesignerActiveJobs(designerId: string): Promise<number> {
    return this._model.countDocuments({ designerId, status: ACTIVE_JOB_STATUS.ACTIVE });
  }

  async countCustomerActiveJobs(userId: string): Promise<number> {
    return this._model.countDocuments({ userId, status: ACTIVE_JOB_STATUS.ACTIVE });
  }

  async getActiveJobBySource(id: string): Promise<IActiveJob | null> {
    return this.findOne({ sourceId: id });
  }

  async updateActiveJob(jobId: string, data: Partial<IActiveJob>, session?: ClientSession): Promise<IActiveJob | null> {
    console.log(session?.id, "from update active job");
    return await this.updateOne({ sourceId: jobId }, data, session);
  }

  async createActiveJOb(data: CreateActiveJobDTO, session?: ClientSession): Promise<IActiveJob> {
    console.log(session?.id, "create acctve job");
    return await this.create(
      {
        designerId: new mongoose.Types.ObjectId(data.designerId),
        userId: new mongoose.Types.ObjectId(data.userId),
        sourceId: new mongoose.Types.ObjectId(data.sourceId),
        sourceType: data.sourceType,
        sourceName: data.sourceName,
      },
      session,
    );
  }

  async getAllActiveJobPerDesigner(designerId: string): Promise<IActiveJob[]> {
    return await this.find({ designerId, status: ACTIVE_JOB_STATUS.ACTIVE });
  }

  async getActiveJob(id: string): Promise<IActiveJob | null> {
    return await this.findById(id);
  }


  async getAllActiveJobs(userId: string, userRole:UserRoleNoAdmin, filter?: ActiveJobsQueryParams): Promise<{ data: ActiveJobPopulated[]; pagination: Pagination }> {
    const page = filter?.page ? Number(filter.page) : 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const SORT_MAP: Record<sortByTypes, Record<string, 1 | -1>> = {
      newest: { createdAt: -1, _id: -1 },
      oldest: { createdAt: 1, _id: 1 },
      name_asc: { sourceName: 1, _id: 1 },
      name_desc: { sourceName: -1, _id: -1 },
    };
    const sort = SORT_MAP[filter?.sortBy as sortByTypes] ?? SORT_MAP.newest;
    const query: QueryFilter<IActiveJob> = { };
    if(USER_TYPE.DESIGNER === userRole){
      query.designerId = userId
    }else{
      query.userId = userId
    }
    if (filter) {
      if (filter.sourceName) query.sourceName = toCleanRegExp(filter.sourceName);
      if (filter.status) query.status = filter.status;
      if (filter.sourceType) query.sourceType = filter.sourceType;
      if (filter.proposalStatus) query.proposalStatus = filter.proposalStatus;

      const start = validateDate(filter.startDate, "startDate");
      const end = validateDate(filter.endDate, "endDate");
      if (start || end) {
        query.createdAt = {
          ...(start && { $gte: start }),
          ...(end && { $lte: end }),
        };
      }
    }
    console.log(query)
    const [result, total] = await Promise.all([
      this._model.find(query).populate<{ userId: IUser }>("userId").populate<{ designerId: IUser }>("designerId").sort(sort).skip(skip).limit(limit).exec(),
      this._model.countDocuments(query),
    ]);
    const pagination: Pagination = {
      total,
      totalPages: Math.ceil(total / limit),
    };

    return { data: result as ActiveJobPopulated[], pagination };
  }
}
