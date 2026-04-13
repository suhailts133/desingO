import mongoose from "mongoose";
import type { AllJobApplicationsDTO, IJobApplicationRequestDTO, JobApplicationFilter, JobApplicationApprovalOrRejectionRequestDTO, JobApplicationApprovalOrRejectionResponseDTO, MyJobApplicationsDTO } from "../../DTO/designer/jobsDTO.js";
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


    
    async changeStatusForPendingUser(id: string, jobId: string): Promise<void> {

        const res = await this._model.updateMany(
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
        console.log(res)

    }

    async applyForJob(customerId: string, data: IJobApplicationRequestDTO): Promise<void> {
        await this.create({
            designerId: new mongoose.Types.ObjectId(data.userId),
            customerId: new mongoose.Types.ObjectId(customerId),
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
            status: result.status as "Ongoing" | "Rejected",
            ...(result.rejectionReason && { rejectionReason: result.rejectionReason }),
            jobId: result._id.toString()
        }
        return output
    }

    async getMyJobApplications(userId: string, filters?: JobApplicationFilter): Promise<{ data: MyJobApplicationsDTO[]; pagination: Pagination; }> {
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

        const output: MyJobApplicationsDTO[] = result.map(data => {
            return {
                id: data.id,
                status: data.status,
                ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
                jobId: data.jobId.id,
                jobTitle: data.jobId.projectTitle,
                propertyType: data.jobId.propertyType,
                timeLine: data.jobId.timeline,
                numberOfRooms: data.jobId.rooms.length,
                description: data.jobId.description,
                createdOn: data.createdAt.toDateString()
            }
        })
        return { data: output, pagination }
    }

    async getAllJobApplications(userId: string, filters?: JobApplicationFilter): Promise<{ data: AllJobApplicationsDTO[]; pagination: Pagination; }> {
        const page = filters?.page ? Number(filters.page) : 1;
        const limit = 9;
        const skip = (page - 1) * limit;
        const query: QueryFilter<IJobApplication> = { customerId: userId };
        if (filters) {
            if (filters.status) {
                query.status = filters.status
            }
        }
        const result = await this._model.find(query)
            .populate<{ jobId: IJobRequest }>("jobId")
            .populate<{ designerId: IUser }>("designerId")
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
            jobId: data.jobId.id,
            jobTitle: data.jobId.projectTitle,
            designerId: data.designerId.id,
            designerName: data.designerId.full_name,
            ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
            propertyType: data.jobId.propertyType,
            timeLine: data.jobId.timeline,
            id: data.id
        }))


        return { data: output, pagination }
    }
}