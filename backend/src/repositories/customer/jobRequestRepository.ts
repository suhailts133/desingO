import mongoose, { type QueryFilter, type SortOrder } from "mongoose";
import type { ICreateJobRequest, IJobRequest, IJobRequestCustomerPopulated, IJobRequestPopulated, Source_type } from "../../interfaces/customer/ICustomer";
import type { IJobRepository } from "../../interfaces/customer/ICustomerRepository";
import { JobRequestModel } from "../../models/user/jobModel";
import { BaseRepository } from "../baseRepository";
import type { Pagination } from "../../DTO/admin/adminDTO";
import type { EditJobRepoData, JobFilter } from "../../DTO/user/jobsDTO";
import type { IUser } from "../../interfaces/auth/IUser";
import type { ImageUploadResult } from "../../interfaces/base/IImageUpload";
import { JOB_REQUEST_FILTERS } from "../../shared/enums/filterEnums";
import { JOB_REQUEST_STATUS, JOB_SOURCE_TYPE } from "../../shared/enums/commonEnums";
import type { HireDesignerFilter } from "../../DTO/user/hireDesignerDTO";

export class JobRequestRepository extends BaseRepository<IJobRequest> implements IJobRepository {
    constructor() {
        super(JobRequestModel)
    }

    async countJobs(userId: string): Promise<number> {
        return this._model.countDocuments({ userId});
    }


    async updateHireRequest(id: string, data: Partial<IJobRequest>): Promise<IJobRequest | null> {
        return await this.update(id, data)
    }

    async changeStatus(id: string, status: string): Promise<IJobRequest | null> {

        const res = await this._model.findByIdAndUpdate(id, { $set: { status } }, { returnDocument: "after" }).exec()
        console.log(res)
        return res
    }

    async createJobRequest(userId: string, data: ICreateJobRequest, referenceImages?: ImageUploadResult[], floorplans?: ImageUploadResult[]): Promise<boolean> {
        const { designId, designerId, ...restOfData } = data;
        const result = await this.create({
            ...restOfData,
            referenceImages: referenceImages ?? [],
            floorPlans: floorplans ?? [],
            userId: new mongoose.Types.ObjectId(userId),
            ...(designerId && { designerId: new mongoose.Types.ObjectId(designerId) }),
            ...(designId && { designId: new mongoose.Types.ObjectId(designId) })
        });
        return !!result
    }

    async editJobRequest(id: string, data: EditJobRepoData, referenceImages?: ImageUploadResult[], floorplans?: ImageUploadResult[]): Promise<boolean> {
        const updateData: QueryFilter<IJobRequest> = {
            ...data,
            referenceImages: referenceImages ?? [],
            floorPlans: floorplans ?? []
        }
        const result = await this.update(id, { $set: updateData })
        return !!result
    }


    async getMyJobs(userId: string, sourceType: Source_type, page?: string): Promise<{ data: IJobRequest[]; pagination: Pagination; }> {
        const pageNo = page ? Number(page) : 1;
        const limit = 6;
        const result = await this._model.find({ userId, sourceType })
            .skip((pageNo - 1) * limit)
            .limit(limit)
            .sort({ createdAt: 1 })
            .exec()
        const total = await this._model.countDocuments({ userId, sourceType });

        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        }
        return {
            data: result,
            pagination
        }
    }

    async getjobRequestPerDesign(designId: string, filters?: HireDesignerFilter): Promise<{ data: IJobRequestCustomerPopulated[]; pagination: Pagination; }> {
        const page = filters?.page ? Number(filters.page) : 1;
        const limit = 6
        const skip = (page - 1) * limit;
        const query: QueryFilter<IJobRequest> = { designId: designId };
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
        query.status = JOB_REQUEST_STATUS.PENDING
        query.sourceType = JOB_SOURCE_TYPE.JOB_REQUEST

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
            .populate<{ designerId: IUser }>("designerId")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(sortOrder)
            .exec()

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
            .populate<{ userId: IUser }>("userId")
            .populate<{ designerId: IUser }>("designerId").exec()
        if (!result) {
            return null
        }
        return result


    }
}