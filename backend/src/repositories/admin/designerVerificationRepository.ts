import type { DesignerFilterDTO, AdminDesignerApprovalRequestDTO, Pagination } from "../../DTO/admin/adminDTO";
import type { IDesignerVerificationRepository, IFacetQueryResult } from "../../interfaces/admin/IDesignerVerificationRespository";
import type { IUser } from "../../interfaces/auth/IUser";
import type { IDesigner, IDesignerPopulated } from "../../interfaces/designer/IDesigner";
import { DesignerModel } from "../../models/designer/designerModel";
import { toCleanRegExp } from "../../shared/helpers/extraFunctions";
import { BaseRepository } from "../baseRepository";
import type { PipelineStage } from "mongoose";

export class DesignerVerificationManagementRepository extends BaseRepository<IDesigner> implements IDesignerVerificationRepository {
    constructor() {
        super(DesignerModel)
    }

    async getAllDesignerRequest(filter?: DesignerFilterDTO): Promise<{ data: IDesignerPopulated[]; pagination: Pagination; }> {
        const page = filter?.page ? Number(filter.page) : 1
        const limit = 10
        const skip = (page - 1) * limit
        const pipeline: PipelineStage[] = []
        if (filter?.status) {
            pipeline.push({
                $match: { status: filter.status }
            })
        }
        pipeline.push(
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $unwind: "$userId"
            }
        )
        if (filter?.debouncedName) {
            pipeline.push(
                {
                    $match: { "userId.full_name": toCleanRegExp(filter.debouncedName) }
                }
            )
        }

        pipeline.push(
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        )
        const [aggregateResult] = await this._model.aggregate<IFacetQueryResult>(pipeline)

        const data = (aggregateResult?.data || []) as unknown as IDesignerPopulated[]
        const total = aggregateResult?.totalCount[0]?.count || 0;
        return {
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    }


    async getDesignerRequest(id: string): Promise<IDesignerPopulated | null> {
        const result = await this._model.findById(id).populate<{ userId: IUser }>("userId").exec()

        if (!result) {
            return null
        }

        return result
    }

    async ApproveOrReject(id: string, data: AdminDesignerApprovalRequestDTO): Promise<IDesignerPopulated | null> {
        const result = await this._model.findByIdAndUpdate(id, data, { returnDocument: "after" }).populate<{ userId: IUser }>("userId").exec();
        if (!result) {
            return null
        }
        return result
    }
}
