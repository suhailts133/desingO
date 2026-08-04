import mongoose from "mongoose";
import type { IJobApplicationRequestDTO, JobApplicationFilter, JobApplicationApprovalOrRejectionRequestDTO } from "../../DTO/designer/jobsDTO";
import type { IJobApplication, IJobApplicationPopulated, IJobApplicationPopulatedWithJobAndUser } from "../../interfaces/designer/IDesigner";
import type { IJobApplicationRepository } from "../../interfaces/designer/IDesignerRepository";
import { JobApplicationModel } from "../../models/designer/jobApplicationModel";
import { BaseRepository } from "../baseRepository";
import type { Pagination } from "../../DTO/admin/adminDTO";
import type { QueryFilter, SortOrder } from "mongoose";
import type { IJobRequest } from "../../interfaces/customer/ICustomer";
import type { IUser } from "../../interfaces/auth/IUser";

export class JobApplicationRepository extends BaseRepository<IJobApplication> implements IJobApplicationRepository {
    constructor() {
        super(JobApplicationModel)
    }



    async changeStatusForPendingUser(id: string, jobId: string): Promise<void> {

        await this._model.updateMany(
            {
                _id: { $ne: id },
                jobId: jobId,
                status: "Pending"
            },
            {
                $set: {
                    status: "Rejected",
                    rejectionReason: "Already accepted another job application."
                }
            }
        )


    }

    async applyForJob(customerId: string, data: IJobApplicationRequestDTO): Promise<void> {

        await this.create({
            designerId: new mongoose.Types.ObjectId(data.userId),
            customerId: new mongoose.Types.ObjectId(customerId),
            jobId: new mongoose.Types.ObjectId(data.jobId)
        })

    }

    async checkUserJobApplication(userId: string, jobId: string): Promise<boolean> {
        const result = await this.findOne({ designerId: userId, jobId: jobId })
       
        return !!result
    }

    async deleteJobApplication(id: string): Promise<boolean> {
        return this.delete(id)
    }

    async approveOrRejectJobApplication(id: string, data: JobApplicationApprovalOrRejectionRequestDTO): Promise<IJobApplication | null> {
        const result = await this._model.findByIdAndUpdate(id, data, { returnDocument: "after" }).exec();

        if (!result) {
            return null
        }
        return result
    }

    async getMyJobApplications(userId: string, filters?: JobApplicationFilter): Promise<{ data: IJobApplicationPopulated[]; pagination: Pagination; }> {
        const page = filters?.page ? Number(filters.page) : 1;
        const limit = 9;
        const skip = (page - 1) * limit;
        const query: QueryFilter<IJobApplication> = { designerId: userId };
        if (filters) {
            if (filters.status) {
                query.status = filters.status
            }
        }
        const result = await this._model.find(query)
            .populate<{ jobId: IJobRequest }>("jobId")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec()

        const total = await this._model.countDocuments(query)
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        }



        return { data: result, pagination }
    }

    async getJobApplications(jobId: string, filters?: JobApplicationFilter): Promise<{ data: IJobApplicationPopulatedWithJobAndUser[]; pagination: Pagination; }> {

        const page = filters?.page ? Number(filters.page) : 1;
        const limit = 1;
        const skip = (page - 1) * limit;
        const query: QueryFilter<IJobApplication> = { jobId: jobId };
        const sortOrder: { [key: string]: SortOrder } = { createdAt: -1 }

        if (filters) {
            if (filters.status) {
                query.status = filters.status
            }

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

        const result = await this._model.find(query)
            .populate<{ jobId: IJobRequest }>("jobId")
            .populate<{ designerId: IUser }>("designerId")
            .sort(sortOrder)
            .skip(skip)
            .limit(limit)
            .exec()

        const total = await this._model.countDocuments(query)
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        }

        return { data: result, pagination }
    }
}