import type { IUser } from "../../interfaces/auth/IUser";
import type { ImageUploadResult } from "../../interfaces/base/IImageUpload";
import type { IDispute } from "../../interfaces/proposal/IDispute";
import type { DisputeStatus, EscrowStatus, IProposal, ProposalServiceStatus } from "../../interfaces/proposal/IProposal";

export interface DisputeRaiseDTO {
    reason: string,
    type: string,
    evidence: Express.Multer.File[]
    sourceId: string,
    order: string
}

export type DisputeRaiseBody = Omit<DisputeRaiseDTO, "evidence">

export interface AcceptOrRejectDisputeDTO {
    status: "Resolved" | "Redo",
    disputeId: string
}

export interface DisputeResponseDTO {
    id: string
    raisedBy: "Customer" | "Designer";
    serviceOrder: number;
    reason: string;
    contractStatus?:string,
    evidence: string[];
    status: DisputeStatus;
    resolution?: string;
    resolutionType?: string;
}


export interface DisputeRepoDTO {
    proposalId: string,
    raisedBy: "Customer" | "Designer";
    serviceOrder: number;
    reason: string;
    type: string;
    evidence: ImageUploadResult[];
    customerId: string
    designerId: string

}

export interface DisputeUpdateDTO {
    status: DisputeStatus;
    resolution: string;
    refundAmount: number
    resolutionType: string;
    resolvedAt: Date;
}


export interface DisputeAdminFilters {
    page?: string,
    sort?: "asc" | "desc",
    status?: DisputeStatus
}

export type DisputePopulated = Omit<IDispute, "customerId" | "designerId"> & {
    designerId: IUser,
    customerId: IUser
}



export type DisputePopulatedAll = Omit<IDispute, "customerId" | "designerId" | "proposalId"> & {
    designerId: IUser,
    customerId: IUser
    proposalId: IProposal

}


export interface AllDisputeAdminDTO {
    id: string
    raisedBy: "Customer" | "Designer";
    reason: string;
    type: string
    status: DisputeStatus;
    createdAt: string;
}


export interface DisputeDetailAdminDTO {
    id: string,
    proposalId: string,
    raisedBy: "Customer" | "Designer";
    reason: string;
    type: string
    resolutionType?:string
    resolution?:string
    status: DisputeStatus;
    createdAt: string;
    evidence: string[],
    customerName: string
    designerName: string
    customerId: string
    designerId: string
    customerImage?: string
    designerImage?: string
    currentService: currentDisputedService
}


export interface currentDisputedService {
    serviceName: string;
    order: number;
    price: number;
    executionPrice: number;
    serviceStatus: ProposalServiceStatus;
    uploadedImages?: string[];
    currentVersion: number;
    expectedDeliveryDate: string;
    actualDeliveryDate?: string;
    paidAt?: string;
    amountHeld?: number;
    platformCommission?: number;
    designerPayout?: number;
    escrowStatus?: EscrowStatus;
    releasedAt?: string;
}


export interface DisputeSolutionDTO {
    resolution: string;
    resolutionType: string;
    refundAmount: number
    disputeId: string;
}

export interface DisputeSolutionResponseDTO extends DisputeSolutionDTO {
    status:DisputeStatus
    
}


