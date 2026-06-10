import type { ImageUploadResult } from "../../interfaces/base/IImageUpload.js";
import type { VersionStatus } from "../../interfaces/proposal/IProposal.js";

export interface CreateServiceVersionRepoDTO {
    proposalId: string;
    sourceId:string,
    serviceOrder: number;
    version: number;
    images: ImageUploadResult[];
}


export interface VersionAcceptOrRejectDTO {
    status: "Rejected" | "Approved",
    rejectionReason?: string,
    versionId: string
}

export type approveOrRejectVersionResponseDTO = Omit<VersionAcceptOrRejectDTO, "status"> & {
    status: VersionStatus
}
