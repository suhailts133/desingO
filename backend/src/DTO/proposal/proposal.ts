import type { IServiceItem } from "../../interfaces/proposal/IProposal.js";

export interface ServiceItem {
    serviceName: string;
    order: number;
    price: number;
    executionPrice: number;
    revisionLimit: number;
    expectedDeliveryDate: Date;
    actualDeliveryDate?: Date;
}


export interface CreateProposalDTO {
    sourceId: string
    sourceType: "jobRequest" | "directHire"
    drawingFeePerSqFt: number;
    advanceFee: number;
    expectedCompletionDate: Date;
    services: ServiceItem[]

}

export interface CreateProposalRepoDataDTO extends Omit<CreateProposalDTO, "services"> {
    clientId: string
    designerId: string
    totalDrawingFee: number
    totalExecutionFee: number
    totalContractValue: number
    services: IServiceItem[]
}

export interface ProposalTemplate {
    jobId: string
    minPrice: number
    maxPrice: number
    services: string[]
}