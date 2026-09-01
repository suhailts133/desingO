import type { IUser } from "../../interfaces/auth/IUser";
import type { IJobRequest } from "../../interfaces/customer/ICustomer";
import type { ContractStatus, IProposal, IServiceItem, ProposalPaymentStatus, ProposalServiceStatus, VersionStatus } from "../../interfaces/proposal/IProposal";

export interface ServiceItem {
    serviceName: string;
    order: number;
    price: number;
    executionPrice: number;
    expectedDeliveryDate: Date;
    actualDeliveryDate?: Date;
}




export interface UpdateProposalDTO {
    proposalId: string
    sourceId: string
    drawingFeePerSqFt: number
    expectedCompletionDate: Date
    siteVisitingNeeded: boolean
    expectedSiteVisitingDate?: Date
    services: ServiceItem[]
}

export interface UpdateProposalRepoDataDTO {
    unit: "ft" | "m";
    totalArea: number;
    totalDrawingFee: number;
    totalExecutionFee: number;
    overallRejectionReason: string
    contractStatus: ContractStatus;
    platformFee: number;
    remainingPlatformFee: number;
    totalContractValue: number;
    expectedCompletionDate: Date;
    siteVisitingNeeded: boolean
    expectedSiteVisitingDate?: Date
    services: IServiceItem[];

}

export interface CreateProposalDTO {
    sourceId: string
    drawingFeePerSqFt: number;
    expectedCompletionDate: Date;
    siteVisitingNeeded: boolean,
    expectedSiteVisitingDate?: Date
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
export type IProposalSourcePopulated = Omit<IProposal, "sourceId" > & {
    sourceId:IJobRequest
}

export interface CreateProposalRepoDataDTO extends Omit<CreateProposalDTO, "services"> {
    clientId: string
    designerId: string
    activeJobId:string
    totalArea: number
    totalDrawingFee: number
    totalExecutionFee: number
    totalContractValue: number
    sourceName: string
    currentAmountHeld:number
    platformFee: number;
    unit: "ft" | "m"
    remainingPlatformFee: number;
    services: IServiceItem[]
}

export interface ProposalInputData {
    jobId: string
    minPrice: number
    maxPrice: number
    timeLine: string
    services: string[];
    totalArea: number;
    unit: "ft" | "m"
    siteVisitingRequired: boolean
}



export interface ProposalDetailDTO {
    id: string
    sourceId: string
    clientId: string
    designerId: string
    clientName: string
    designerName: string
    disputeCount: number
    clientProfile?: string
    designerProfile?: string
    sourceName: string
    totalArea: number;
    unit: "ft" | "m"
    siteVisitingRequired: boolean
    expectedSiteVisitingDate?: string
    floorPlans?: string[]
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

