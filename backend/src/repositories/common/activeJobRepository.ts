import mongoose, { type QueryFilter } from "mongoose";
import type { ActiveJobFilter, ActiveJobPopulateAll, ActiveJobPopulated, CreateActiveJobDTO } from "../../DTO/user/activeJobDTO.js";
import type { IUser } from "../../interfaces/auth/IUser.js";
import type { IActiveJob, IHireDesigner, IJobRequest } from "../../interfaces/customer/ICustomer.js";
import type { IActiveJobRepository } from "../../interfaces/customer/ICustomerRepository.js";
import { ActiveJobModel } from "../../models/user/ActiveJobModal.js";
import { ACTIVE_JOB_STATUS } from "../../shared/enums/commonEnums.js";
import { BaseRepository } from "../baseRepository.js";
import type { Pagination } from "../../DTO/admin/adminDTO.js";
import { HireDesignerModel } from "../../models/user/hireDesignerModel.js";
import { JobRequestModel } from "../../models/user/jobModel.js";

export class ActiveJobRepository extends BaseRepository<IActiveJob> implements IActiveJobRepository {
    constructor() {
        super(ActiveJobModel)
    }

    async getActiveJobBySource(id: string): Promise<IActiveJob | null> {
        return this.findOne({ sourceId: id })
    }

    async updateActiveJob(jobId: string, data: Partial<IActiveJob>): Promise<IActiveJob | null> {
        const result = await this.updateOne({sourceId:jobId}, data)
        return result
    }

    async createActiveJOb(data: CreateActiveJobDTO): Promise<IActiveJob> {
        return await this.create({
            designerId: new mongoose.Types.ObjectId(data.designerId),
            userId: new mongoose.Types.ObjectId(data.userId),
            sourceId: new mongoose.Types.ObjectId(data.sourceId),
            sourceType: data.sourceType,
            sourceName: data.sourceName
        })
    }

    async getAllActiveJobPerDesigner(designerId: string): Promise<IActiveJob[]> {
        return await this.find({ designerId, status: ACTIVE_JOB_STATUS.ACTIVE })
    }

    async getActiveJob(id: string): Promise<IActiveJob | null> {
        return await this.findById(id);
    }

    async getActiveJobPopulated(id: string): Promise<ActiveJobPopulateAll | null> {
        const activeJob = await this.getActiveJob(id);
        if (!activeJob) return null;
        const sourceModel = activeJob.sourceType === "jobRequest" ? JobRequestModel : HireDesignerModel;

        const populated = await this._model.findById(id).
            populate<{ userId: IUser }>("userId").
            populate<{ designerId: IUser }>("designerId").
            populate<{ sourceId: IJobRequest | IHireDesigner }>({
                path: "sourceId",
                model: sourceModel
            }).exec()

        return populated as ActiveJobPopulateAll | null
    }

    async getCustomerActiveJobs(customerId: string, filter?: ActiveJobFilter): Promise<{ data: ActiveJobPopulated[], pagination: Pagination }> {
        const query: QueryFilter<IActiveJob> = { sourceType: filter?.sourceType ?? "jobRequest", userId: customerId };
      
        const page = filter?.page ? Number(filter.page) : 1;
        const limit = 6
        const skip = (page - 1) * limit;

        const [result, total] = await Promise.all([
            this._model.find(query).
                populate<{ userId: IUser }>("userId").
                populate<{ designerId: IUser }>("designerId")
                .skip(skip)
                .limit(limit)
                .exec(),
            this._model.countDocuments(query)
        ])
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        };


        return { data: result as ActiveJobPopulated[], pagination }
    }



    async getDesignerActiveJobs(designerId: string, filter?: ActiveJobFilter): Promise<{ data: ActiveJobPopulated[], pagination: Pagination }> {

        const query: QueryFilter<IActiveJob> = { sourceType: filter?.sourceType ?? "jobRequest", designerId: designerId };
       
        const page = filter?.page ? Number(filter.page) : 1;
        const limit = 6
        const skip = (page - 1) * limit;

        const [result, total] = await Promise.all([
            this._model.find(query).
                populate<{ userId: IUser }>("userId").
                populate<{ designerId: IUser }>("designerId").
                skip(skip)
                .limit(limit)
                .exec(),
            this._model.countDocuments(query)
        ])
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        };


        return { data: result as ActiveJobPopulated[], pagination }
    }
}