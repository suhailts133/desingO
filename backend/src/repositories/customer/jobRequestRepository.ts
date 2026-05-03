import mongoose, { type QueryFilter, type SortOrder } from "mongoose";
import type { ICreateJobRequest, IJobRequest } from "../../interfaces/customer/ICustomer.js";
import type { IJobRepository } from "../../interfaces/customer/ICustomerRepository.js";
import { JobRequestModel } from "../../models/user/jobModel.js";
import { BaseRepository } from "../baseRepository.js";
import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { EditJobRepoData, JobDetailResponseDTO, JobFilter, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO.js";
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

    async getAllJobs(userId: string, page?: string): Promise<{ data: JobsResponseDTO[]; pagination: Pagination; }> {
        const pageNo = page ? Number(page) : 1;
        const limit = 6;
        const result = await this._model.find({ userId })
            .skip((pageNo - 1) * limit)
            .limit(limit)
            .sort({ createdAt: 1 })
            .exec()
        const total = await this._model.countDocuments({ userId });
        const output: JobsResponseDTO[] = result.map(data => {
            return {
                id: data.id,
                projectTitle: data.projectTitle,
                propertyType: data.propertyType,
                status: data.status,
                state: data.state,
                district: data.district,
                city: data.state,
                minBudget: data.minBudget,
                maxBudget: data.maxBudget,
                description: data.description,
                rooms: data.rooms.length,
                timeLine: data.timeline
            }
        })
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        }
        return {
            data: output,
            pagination
        }
    }

    async getAJobRequest(jobId: string): Promise<JobDetailResponseDTO | null> {
        const result = await this._model.findById(jobId)
            .populate<{ userId: IUser }>("userId")
            .exec();
        if (!result) {
            return null
        }
        return {
            id: result.id,
            projectTitle: result.projectTitle,
            propertyType: result.propertyType,
            designStyles: result.designStyles,
            state: result.state,
            district: result.district,
            city: result.city,
            phone: result.phone,
            timeline: result.timeline,
            minBudget: result.minBudget,
            maxBudget: result.maxBudget,
            description: result.description,
            referenceImages: result.referenceImages,
            rooms: result.rooms,
            status: result.status,
            name: result.userId.full_name,
            createdAt: result.createdAt.toDateString(),
            userCreatedAt: result.userId.createdAt.toDateString()
        }
    }

    async getAllJobsCommon(JobFilter?: JobFilter): Promise<{ data: JobsCommonResponseDTO[]; pagination: Pagination; }> {
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
        
        let sortOrder: { [key: string]: SortOrder } = {}
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
        const output: JobsCommonResponseDTO[] = result.map(data => {
            return {
                id: data.id,
                projectTitle: data.projectTitle,
                propertyType: data.propertyType,
                designStyles: data.designStyles,
                minBudget: data.minBudget,
                maxBudget: data.maxBudget,
                name: data.userId.full_name,
                state: data.state,
                district: data.district,
                city: data.city,
                description: data.description,
                createdAt: data.createdAt.toDateString(),
                timeLine: data.timeline,
                rooms: data.rooms.length
            }
        })
        return { data: output, pagination }
    }


    async deleteAJob(id: string): Promise<boolean> {
        return await this.delete(id)
    }

    async getJobRequest(id: string): Promise<IJobRequest | null> {
        const result = await this.findById(id);
        if (!result) {
            return null
        }
        return result


    }
}