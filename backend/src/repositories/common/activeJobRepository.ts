import mongoose from "mongoose";
import type { ActiveJobPopulateAll, CreateActiveJobDTO } from "../../DTO/user/activeJobDTO.js";
import type { IUser } from "../../interfaces/auth/IUser.js";
import type { IActiveJob, IHireDesigner, IJobRequest } from "../../interfaces/customer/ICustomer.js";
import type { IActiveJobRepository } from "../../interfaces/customer/ICustomerRepository.js";
import { ActiveJobModel } from "../../models/user/ActiveJobModal.js";
import { ACTIVE_JOB_STATUS } from "../../shared/enums/commonEnums.js";
import { BaseRepository } from "../baseRepository.js";

export class ActiveJobRepository extends BaseRepository<IActiveJob> implements IActiveJobRepository {
    constructor() {
        super(ActiveJobModel)
    }

    async getActiveJobBySource(id: string): Promise<IActiveJob | null> {
        return this.findOne({ sourceId: id })
    }

    async createActiveJOb(data: CreateActiveJobDTO): Promise<IActiveJob> {
        return await this.create({
            designerId: new mongoose.Types.ObjectId(data.designerId),
            userId: new mongoose.Types.ObjectId(data.userId),
            sourceId: new mongoose.Types.ObjectId(data.sourceId),
            sourceType: data.sourceType
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

        const populated = await this._model.findById(id).
            populate<{ userId: IUser }>("userId").
            populate<{ designerId: IUser }>("designerId").
            populate<{ sourceId: IJobRequest | IHireDesigner }>({
                path: "sourceId",
                model: activeJob.sourceType === "jobRequest" ? "jobRequest" : "HireDesigner"
            }).exec()

        return populated as ActiveJobPopulateAll | null
    }
}