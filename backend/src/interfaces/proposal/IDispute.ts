import type { Pagination } from "../../DTO/admin/adminDTO";
import type { AcceptOrRejectDisputeDTO, DisputeAdminFilters, DisputePopulated, DisputePopulatedAll, DisputePopulateProposal, DisputeRaiseDTO, DisputeRepoDTO, DisputeResponseDTO, DisputeUpdateDTO } from "../../DTO/proposal/dispute";
import type { IApiResponse } from "../base/IApiResponse";
import type { ImageUploadResult } from "../base/IImageUpload";
import type { DisputeStatus } from "./IProposal";
import mongoose from "mongoose";


export interface IDispute {
    id: string
    proposalId: mongoose.Types.ObjectId
    raisedBy: "Customer" | "Designer";
    serviceOrder: number;
    reason: string;
    type: string;
    evidence: ImageUploadResult[];
    status: DisputeStatus;
    resolution?: string;
    resolutionType?: string;
    refundAmount?: number
    createdAt: Date;
    resolvedAt?: Date;
    customerId: mongoose.Types.ObjectId
    designerId: mongoose.Types.ObjectId
}


export interface IDisputeRepository {
    createDispute(data: DisputeRepoDTO): Promise<IDispute>
    updateDispute(id: string, data: Partial<DisputeUpdateDTO>): Promise<IDispute | null>
    getAllDisputeForAdmin(filters?: DisputeAdminFilters): Promise<{ data: DisputePopulated[]; pagination: Pagination; }>
    findDispute(id: string): Promise<DisputePopulatedAll | null>
    getAllDispute(proposalId: string): Promise<DisputePopulatedAll[]>
    getAllDisputePerUserId(userId: string, role: "Designer" | "Customer"): Promise<DisputePopulateProposal[]>
    findDisputeByProposalId(id: string): Promise<DisputePopulatedAll | null>
}


export interface IDisputeService {
    createDispute(data: DisputeRaiseDTO, reporterId: string): Promise<IApiResponse<DisputeResponseDTO>>
    AcceptOrRejectDispute(data: AcceptOrRejectDisputeDTO): Promise<IApiResponse<DisputeStatus>>
    getDispute(proposalId: string): Promise<IApiResponse<DisputeResponseDTO>>
    getAllDisputePerProposal(proposalId: string): Promise<IApiResponse<DisputeResponseDTO[]>>
}

