
import type { IUser } from "../../interfaces/auth/IUser.js";
import type { ImageUploadResult } from "../../interfaces/base/IImageUpload.js";
import type { ContractStatus, IProposal, IServiceItem, PaymentStatus, ServiceStatus } from "../../interfaces/proposal/IProposal.js";

export interface ServiceItem {
    serviceName: string;
    order: number;
    price: number;
    executionPrice: number;
    expectedDeliveryDate: Date;
    actualDeliveryDate?: Date;
}


export interface CreateProposalDTO {
    sourceId: string
    sourceType: "jobRequest" | "direct_hire"
    drawingFeePerSqFt: number;
    expectedCompletionDate: Date;
    services: ServiceItem[]

}


export type GetProposalDTO = Omit<IProposal,  "clientId" | "designerId"> & {
    clientId:IUser
    designerId:IUser
}

export interface CreateProposalRepoDataDTO extends Omit<CreateProposalDTO, "services"> {
    clientId: string
    designerId: string
    totalDrawingFee: number
    totalExecutionFee: number
    totalContractValue: number
    sourceName: string
    services: IServiceItem[]
}

export interface ProposalInputData {
    jobId: string
    minPrice: number
    maxPrice: number
    services: string[];
    sqft: number
}



export interface ProposalDetailDTO {
    id: string
    sourceId: string
    sourceType: "jobRequest" | "direct_hire"
    clientId: string
    designerId: string
    clientName:string
    designerName:string
    clientProfile?:string
    designerProfile?:string
    sourceName: string


    drawingFeePerSqFt: number
    totalDrawingFee: number
    totalExecutionFee: number
    totalContractValue: number


    contractStatus: ContractStatus
    overallRejectionReason?: string


    clientAcceptedAt?: string

    expectedCompletionDate: string
    actualCompletionDate?: string
    createdAt: string


    services: ProposalServiceItemDTO[]
}

export interface ProposalServiceItemDTO {
    serviceName: string
    order: number
    price: number
    executionPrice: number
    status: ServiceStatus
    rejectionReason?: string
    uploadedImages: ImageUploadResult[]
    currentVersion: number
    expectedDeliveryDate: string
    actualDeliveryDate?: string
    paymentStatus: PaymentStatus
    paidAt?: string
}


export interface ProposalAcceptOrRejectDTO {
    contractStatus: "Accepted" | "Rejected",
    overallRejectionReason?: string,
    sourceId: string
}

export type ProposalStatusUpdateRepoDTO = Omit<ProposalAcceptOrRejectDTO, "sourceId">