import type { ImageUploadResult } from "../../interfaces/base/IImageUpload";

export interface floorPlanRepoDTO {
    version: number
    plans: ImageUploadResult
    proposalId: string
}
export interface floorPlanRepoDTO {
    version: number
    plans: ImageUploadResult
    proposalId: string
}

export interface AcceptOrRejectFloorPlanDTO {
    floorPlanId: string,
    status: "Approved" | "Rejected"
    rejectionReason?: string
}