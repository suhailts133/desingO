import mongoose from "mongoose";
import type { AllJobApplicationsDTO, IJobApplicationRequestDTO, JobAllicationFilter, JobApplicationApprovalOrRejectionRequestDTO, JobApplicationApprovalOrRejectionResponseDTO, MyJobApplicationsDTO } from "../../DTO/designer/jobsDTO.js";
import type { IJobApplication } from "../../interfaces/designer/IDesigner.js";
import type { IJobApplicationRepository } from "../../interfaces/designer/IDesignerRepository.js";
import { JobApplicationModel } from "../../models/designer/jobApplicationModel.js";
import { BaseRepository } from "../baseRepository.js";
import type { Pagination } from "../../DTO/admin/adminDTO.js";
import type { QueryFilter } from "mongoose";
import type { IJobRequest } from "../../interfaces/customer/ICustomer.js";
import type { IUser } from "../../interfaces/auth/IUser.js";

export class JobApplicationRepository extends BaseRepository<IJobApplication> implements IJobApplicationRepository {
    constructor() {
        super(JobApplicationModel)
    }

    async applyForJob(data: IJobApplicationRequestDTO): Promise<void> {
        await this.create({
            userId: new mongoose.Types.ObjectId(data.userId),
            jobId: new mongoose.Types.ObjectId(data.jobId)
        })

    }

    async checkUserJobApplication(userId: string, jobId: string): Promise<boolean> {
        const result = await this.findOne({ userId: userId, jobId: jobId })
        return !!result
    }

    async deleteJobApplication(id: string): Promise<boolean> {
        return this.delete(id)
    }

    async approveOrRejectJobApplication(id: string, data: JobApplicationApprovalOrRejectionRequestDTO): Promise<JobApplicationApprovalOrRejectionResponseDTO | null> {
        const result = await this._model.findByIdAndUpdate(id, data, { returnDocument: "after" }).exec();

        if (!result) {
            return null
        }
        const output: JobApplicationApprovalOrRejectionResponseDTO = {
            status: result.status as "Approved" | "Rejected",
            ...(result.rejectionReason && { rejectionReason: result.rejectionReason }),
            jobId: result._id.toString()
        }
        return output
    }

    async getMyJobApplications(userId: string, filters?: JobAllicationFilter): Promise<{ data: MyJobApplicationsDTO[]; pagination: Pagination; }> {
        const page = filters?.page ? Number(filters.page) : 1;
        const limit = 9;
        const skip = (page - 1) * limit;
        const query: QueryFilter<IJobApplication> = { userId: userId };
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

        const output: MyJobApplicationsDTO[] = result.map(data => {
            return {
                id: data.id,
                status: data.status,
                ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
                jobId: data.jobId.toString(),
                jobTitle: data.jobId.projectTitle
            }
        })
        return { data: output, pagination }
    }

    async getAllJobApplications(filters?: JobAllicationFilter): Promise<{ data: AllJobApplicationsDTO[]; pagination: Pagination; }> {
        const page = filters?.page ? Number(filters.page) : 1;
        const limit = 9;
        const skip = (page - 1) * limit;
        const query: QueryFilter<IJobApplication> = {};
        if (filters) {
            if (filters.status) {
                query.status = filters.status
            }
        }
        const result = await this._model.find(query)
            .populate<{ jobId: IJobRequest }>("jobId")
            .populate<{ userId: IUser }>("userId")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec()

        const total = await this._model.countDocuments(query)
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        }
        const output: AllJobApplicationsDTO[] = result.map(data => ({
            status: data.status,
            jobId: data.jobId.toString(),
            jobTitle: data.jobId.projectTitle,
            designerId: data.userId.id,
            designerName: data.userId.full_name,
            ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
        }))

        return { data: output, pagination }
    }
}