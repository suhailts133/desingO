import mongoose, { type QueryFilter } from "mongoose";
import type { ICreateJobRequest, IJobRequest } from "../../interfaces/customer/ICustomer.js";
import type { IJobRepository } from "../../interfaces/customer/ICustomerRepository.js";
import { JobRequestModel } from "../../models/user/jobModel.js";
import { BaseRepository } from "../baseRepository.js";
import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { JobDetailResponseDTO, JobFilter, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO.js";
import type { IUser } from "../../interfaces/auth/IUser.js";

export class JobRequestRepository extends BaseRepository<IJobRequest> implements IJobRepository {
    constructor() {
        super(JobRequestModel)
    }

    async createJobRequest(userId: string, data: ICreateJobRequest): Promise<boolean> {
        const result = await this.create({
            ...data,
            userId: new mongoose.Types.ObjectId(userId)
        })
        return !!result
    }

    async getAllJobs(userId: string, page?: string): Promise<{ data: JobsResponseDTO[]; pagination: Pagination; }> {
        const pageNo = page ? Number(page) : 1;
        const limit = 6;
        const result = await this._model.find({ userId })
            .skip((pageNo - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
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
                price: data.budget,
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
            budget: result.budget,
            description: result.description,
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
        console.log(query)

        let sortOrder: any = { createdAt: -1 };
        if (JobFilter?.sortBy) {
            if (JobFilter.sortBy === "price_asc") {
                sortOrder = { budget: -1 }
            }
            if (JobFilter.sortBy === "price_desc") {
                sortOrder = { budget: 1 }
            }
            if (JobFilter.sortBy === "az") {
                sortOrder = { projectTitle: 1 }
            }
            if (JobFilter.sortBy === "za") {
                sortOrder = { projectTitle: -1 }
            }
        }
        const result = await this._model.find(query)
            .populate<{ userId: IUser }>("userId")
            .sort(sortOrder)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec()

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
                price: data.budget,
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
        console.log(output)

        return { data: output, pagination }
    }


    async deleteAJob(id: string): Promise<boolean> {
        return await this.delete(id)
    }

    async checkJobExists(id: string): Promise<IJobRequest | null> {
     const result = await this.findById(id);
     if(!result){
        return null
     }
     return result   
    

    }
}