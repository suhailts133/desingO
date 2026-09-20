import mongoose, { type ClientSession, type QueryFilter } from "mongoose";
import type { ActiveJobFilter, ActiveJobPopulated, CreateActiveJobDTO } from "../../DTO/user/activeJobDTO";
import type { IUser } from "../../interfaces/auth/IUser";
import type { IActiveJob } from "../../interfaces/customer/ICustomer";
import type { IActiveJobRepository } from "../../interfaces/customer/ICustomerRepository";
import { ActiveJobModel } from "../../models/user/ActiveJobModal";
import { ACTIVE_JOB_STATUS } from "../../shared/enums/commonEnums";
import { BaseRepository } from "../baseRepository";
import type { Pagination } from "../../DTO/admin/adminDTO";

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

  async getCustomerActiveJobs(customerId: string, filter?: ActiveJobFilter): Promise<{ data: ActiveJobPopulated[]; pagination: Pagination }> {
    const query: QueryFilter<IActiveJob> = { sourceType: filter?.sourceType ?? "jobRequest", userId: customerId };

    const page = filter?.page ? Number(filter.page) : 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const [result, total] = await Promise.all([this._model.find(query).populate<{ userId: IUser }>("userId").populate<{ designerId: IUser }>("designerId").skip(skip).limit(limit).exec(), this._model.countDocuments(query)]);
    const pagination: Pagination = {
      total,
      totalPages: Math.ceil(total / limit),
    };

    return { data: result as ActiveJobPopulated[], pagination };
  }

  async getDesignerActiveJobs(designerId: string, filter?: ActiveJobFilter): Promise<{ data: ActiveJobPopulated[]; pagination: Pagination }> {
    const query: QueryFilter<IActiveJob> = { sourceType: filter?.sourceType ?? "jobRequest", designerId: designerId };

    const page = filter?.page ? Number(filter.page) : 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const [result, total] = await Promise.all([this._model.find(query).populate<{ userId: IUser }>("userId").populate<{ designerId: IUser }>("designerId").skip(skip).limit(limit).exec(), this._model.countDocuments(query)]);
    const pagination: Pagination = {
      total,
      totalPages: Math.ceil(total / limit),
    };

    return { data: result as ActiveJobPopulated[], pagination };
  }
}
