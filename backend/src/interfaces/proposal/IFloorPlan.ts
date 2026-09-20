import type mongoose from "mongoose"
import type { AcceptOrRejectFloorPlanDTO, floorPlanRepoDTO } from "../../DTO/proposal/floorplans"
import type { IApiResponse } from "../base/IApiResponse"
import type { ImageUploadResult } from "../base/IImageUpload"
import type { ClientSession } from "mongoose"

export interface IFloorPlan {
    id: string
    version: number
    plans: ImageUploadResult
    proposalId: mongoose.Types.ObjectId;
    createdAt: Date
    rejectionReason?: string
    status: FloorPlanStatus
}

export type FloorPlanStatus = "Approved" | "Rejected" | "Pending"


export interface IFloorPlanService {
    acceptOrRejectFloorPlan(data: AcceptOrRejectFloorPlanDTO): Promise<IApiResponse>
    uploadFloorPlan(proposalId: string, floorPlans: Express.Multer.File): Promise<IApiResponse>;
}


export interface IFloorPlanRepository {
    createFloorPlan(data: floorPlanRepoDTO): Promise<IFloorPlan>
    getAllFloorPlan(proposalId: string): Promise<IFloorPlan[]>
    getFloorPlan(id: string): Promise<IFloorPlan | null>
    updateFloorPlan(id: string, data: Partial<IFloorPlan>, session?:ClientSession): Promise<IFloorPlan | null>
}
