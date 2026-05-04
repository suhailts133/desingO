import mongoose, { type QueryFilter, type SortOrder } from "mongoose";
import type { ICreateJobRequest, IJobRequest, IJobRequestPopulated } from "../../interfaces/customer/ICustomer.js";
import type { IJobRepository } from "../../interfaces/customer/ICustomerRepository.js";
import { JobRequestModel } from "../../models/user/jobModel.js";
import { BaseRepository } from "../baseRepository.js";
import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { EditJobRepoData,JobFilter } from "../../DTO/user/jobsDTO.js";
import type { IUser } from "../../interfaces/auth/IUser.js";
import type { ImageUploadResult } from "../../interfaces/base/IImageUpload.js";
import { JOB_REQUEST_FILTERS } from "../../shared/enums/filterEnums.js";

export class JobRequestRepository extends BaseRepository<IJobRequest> implements IJobRepository {
    constructor() {
        super(JobRequestModel)
    }




    async createJobRequest(userId: string, data: ICreateJobRequest, referenceImages?: ImageUploadResult[]): Promise<boolean> {
        const result = await this.create({
            ...data,
            referenceImages: referenceImages ?? [],
            userId: new mongoose.Types.ObjectId(userId)
        })
        return !!result
    }

    async editJobRequest(id: string, data: EditJobRepoData, referenceImages?: ImageUploadResult[]): Promise<boolean> {
        const updateData: QueryFilter<IJobRequest> = {
            ...data,
            referenceImages: referenceImages ?? []
        }
        const result = await this.update(id, { $set: updateData })
        return !!result
    }

    async getMyJobs(userId: string, page?: string): Promise<{ data: IJobRequest[]; pagination: Pagination; }> {
        const pageNo = page ? Number(page) : 1;
        const limit = 6;
        const result = await this._model.find({ userId })
            .skip((pageNo - 1) * limit)
            .limit(limit)
            .sort({ createdAt: 1 })
            .exec()
        const total = await this._model.countDocuments({ userId });

        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        }
        return {
            data: result,
            pagination
        }
    }


    async getAllJobs(JobFilter?: JobFilter): Promise<{ data: IJobRequestPopulated[]; pagination: Pagination; }> {
        const page = JobFilter?.page ? Number(JobFilter?.page) : 1;
        const limit = 9;
        const query: QueryFilter<IJobRequest> = {}
        if (JobFilter) {
            if (JobFilter.designStyles) {
                query.designStyles = { $in: JobFilter.designStyles.split(",") }
            }
            if (JobFilter.propertyTypes) {
                query.propertyType = { $in: JobFilter.propertyTypes.split(",") }
            }
            if (JobFilter.timeLines) {
                query.timeline = { $in: JobFilter.timeLines.split(",") }
            }

        }
        query.status = "Pending"

        const sortOrder: { [key: string]: SortOrder } = {}
        if (JobFilter?.sortBy) {
            if (JobFilter.sortBy === JOB_REQUEST_FILTERS.PRICE_INCREASING) {
                sortOrder.minBudget = 1
            }
            if (JobFilter.sortBy === JOB_REQUEST_FILTERS.LATEST) {
                sortOrder.createdAt = -1
            }
            if (JobFilter.sortBy === JOB_REQUEST_FILTERS.OLDEST) {
                sortOrder.createdAt = 1
            }
            if (JobFilter.sortBy === JOB_REQUEST_FILTERS.PRICE_DECREASING) {
                sortOrder.minBudget = -1
            }
            if (JobFilter.sortBy === JOB_REQUEST_FILTERS.AZ) {
                sortOrder.projectTitle = 1
            }
            if (JobFilter.sortBy === JOB_REQUEST_FILTERS.ZA) {
                sortOrder.projectTitle = -1
            }
        }

        const result = await this._model.find(query)
            .populate<{ userId: IUser }>("userId")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(sortOrder)
            .exec()
        console.log(result)
        const total = await this._model.countDocuments(query)
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        }

        return { data: result, pagination }
    }


    async deleteAJob(id: string): Promise<boolean> {
        return await this.delete(id)
    }

    async getJobRequest(id: string): Promise<IJobRequestPopulated | null> {
        const result = await this._model.findById(id)
            .populate<{ userId: IUser }>("userId");
        if (!result) {
            return null
        }
        return result


    }
}