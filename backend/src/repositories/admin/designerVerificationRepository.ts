import type { DesignerFilterDTO, AdminDesignersResponseDTO, AdminDesignerRequestResponseDTO, AdminDesignerWorkExperience, AdminDesignerEducation, AdminDesignerApprovalDTO, AdminDesignerApprovalRequestDTO, Pagination } from "../../DTO/admin/adminDTO.js";
import type { IDesignerVerificationRepository } from "../../interfaces/admin/IDesignerVerificationRespository.js";
import type { IUser } from "../../interfaces/auth/IUser.js";
import type { IDesigner } from "../../interfaces/designer/IDesigner.js";
import { DesignerModel } from "../../models/designer/designerModel.js";
import { UserModel } from "../../models/user/userModel.js";
import { BaseRepository } from "../baseRepository.js";
import type { QueryFilter } from "mongoose";

export class DesignerVerificationManagementRepository extends BaseRepository<IDesigner> implements IDesignerVerificationRepository {
    constructor() {
        super(DesignerModel)
    }

    async getAllDesignerRequest(filter?: DesignerFilterDTO): Promise<{ data: AdminDesignersResponseDTO[], pagination: Pagination }> {
        const page = filter?.page ? Number(filter.page) : 1;
        const limit = 10;
        const query: QueryFilter<DesignerFilterDTO> = {}
        if (filter) {
            if (filter.name) {
                const matchingUsers = await UserModel.find({ full_name: { $regex: filter.name, $options: "i" } })
                const userIds = matchingUsers.map(u => u._id);
                query.userId = { $in: userIds }
            }
            if (filter.status) {
                query.status = filter.status
            }
        }

        const result = await this._model.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate<{ userId: IUser }>("userId")
            .exec()
        const total = await this._model.countDocuments(query)

        const output: AdminDesignersResponseDTO[] = result.map(data => {

            return {
                id: data._id.toString(),
                full_name: data.userId.full_name,
                status: data.status,
                createdAt: data.createdAt.toISOString()
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

    async getDesignerRequest(id: string): Promise<AdminDesignerRequestResponseDTO | null> {
        const result = await this._model.findById(id).populate<{ userId: IUser }>("userId").exec()

        if (!result) {
            return null
        }

        const workExpData: AdminDesignerWorkExperience[] = result.workExperience?.map(data => {
            return {
                companyName: data.companyName,
                role: data.role,
                yearsOfExperience: data.yearsOfExperience,
                proof: data.proof.path
            }
        }) ?? []

        const educationData: AdminDesignerEducation[] = result.education.map(data => {
            return {
                institutionName: data.institutionName,
                courseName: data.courseName,
                completionYear: data.completionYear,
                certification: data.certification.path
            }
        })

        const output: AdminDesignerRequestResponseDTO = {
            id: result._id.toString(),
            full_name: result.userId.full_name,
            userId: result.userId.id,
            status: result.status,
            govtIdType: result.governmentIdType,
            Portfolio: result.portfolioUrl,
            education: educationData,
            workExperience: workExpData,
            rejectionReason: result.rejectionReason ?? "",
            govtIdImage: result.govtIdImage.path,
            bio: result.bio
        }
        return output
    }

    async ApproveOrReject(id: string, data: AdminDesignerApprovalRequestDTO): Promise<AdminDesignerApprovalDTO | null> {
        const result = await this._model.findByIdAndUpdate(id, data, { returnDocument: "after" }).populate<{ userId: IUser }>("userId").exec();

        if (!result) {
            return null
        }
        const output: AdminDesignerApprovalDTO = {
            status: result.status as "Approved" | "Rejected",
            ...(result.rejectionReason && { rejectionReason: result.rejectionReason }),
            name: result.userId.full_name,
            email: result.userId.email,
            userId: result.userId.id
        }


        return output
    }
}
