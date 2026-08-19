import type { IUser } from "../../interfaces/auth/IUser";
import type { ContractStatus, IProposal, IServiceItem, ProposalPaymentStatus, ProposalServiceStatus, VersionStatus } from "../../interfaces/proposal/IProposal";

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


export interface IRoom {
    length: number;
    width: number;
    unit: string;
}

export interface IProjectSource {
    rooms: IRoom[];
}
export type GetProposalDTO = Omit<IProposal, "clientId" | "designerId"> & {
    clientId: IUser
    designerId: IUser
}

export interface CreateProposalRepoDataDTO extends Omit<CreateProposalDTO, "services"> {
    clientId: string
    designerId: string
    totalDrawingFee: number
    totalExecutionFee: number
    totalContractValue: number
    sourceName: string
    platformFee: number;
    remainingPlatformFee: number;
    services: IServiceItem[]
}

export interface ProposalInputData {
    jobId: string
    minPrice: number
    maxPrice: number
    timeLine: string
    services: string[];
    sqft: number
}



export interface ProposalDetailDTO {
    id: string
    sourceId: string
    sourceType: "jobRequest" | "direct_hire"
    clientId: string
    designerId: string
    clientName: string
    designerName: string
    clientProfile?: string
    designerProfile?: string
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


export interface VersionDTO {
    serviceOrder: number
    versionId: string,
    images: string[]
    status: VersionStatus,
    rejectionReason?: string
}


export interface AllVersion {
    versionNumber: number
    versionData: VersionDTO
}

export interface ProposalServiceItemDTO {
    serviceName: string
    order: number
    price: number
    executionPrice: number
    status: ProposalServiceStatus
    rejectionReason?: string
    versions: AllVersion[]
    currentVersion: number
    expectedDeliveryDate: string
    actualDeliveryDate?: string
    paymentStatus: ProposalPaymentStatus
    paidAt?: string
}


export interface ProposalAcceptOrRejectDTO {
    contractStatus: "Accepted" | "Rejected",
    overallRejectionReason?: string,
    sourceId: string
}

export interface ProposalStatusUpdateRepoDTO {
    contractStatus: ContractStatus;
    overallRejectionReason?: string;
    "services.$.status"?: ProposalServiceStatus;
}



export interface ProposalStatusFilter {
    sourceId: string;
    "services.order"?: number;
}

export interface ServiceImageUploadResponseDTO {
    versionNumber: number
    versionId: string
    images: string[]
}

export interface ServiceResultDTO {
    serviceNumber: number;
    sourceId: string;
}