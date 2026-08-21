export type ServiceStatus = "Locked" | "Open" | "In Progress" | "Uploaded" | "Redo" | "Completed"

export type PaymentStatus = "Pending" | "Paid" | "Refunded"

export type EscrowStatus = "Held" | "Released" | "Refunded" | "Disputed"

export type ContractStatus = "Sent" | "Accepted" | "Rejected" | "Ongoing" | "Completed" | "Disputed" | "Expired"

export type DisputeStatus = "Open" | "Under Review" | "Resolved" | "Redo" | "Awaiting Confirmation"

export interface IServiceResult {
    serviceResult: {
        file: File[]
    }[]
}
export interface VersionAcceptOrRejectDTO {
    status: "Rejected" | "Approved",
    rejectionReason?: string,
    versionId: string
}

export interface DisputeFormDTO {
    reason: string,
    type: { value: string; label: string };
    evidence: {
        file: File[];
    }[];
}

export interface FloorPlans {
    floorPlans: {
        file: File[];
    }[];
}
export interface AcceptOrRejectDisputeDTO {
    status: "Resolved" | "Redo",
    disputeId: string
}


export interface DisputeResponseDTO {
    id: string
    raisedBy: "Customer" | "Designer";
    serviceOrder: number;
    reason: string;
    contractStatus: string,
    evidence: string[];
    status: DisputeStatus;
    resolution?: string;
    resolutionType?: string;
}


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
    drawingFeePerSqFt: number;
    expectedCompletionDate: Date;
    siteVisitingNeeded: boolean,
    expectedSiteVisitingDate?: Date
    services: ServiceItem[]
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

export interface ProposalInputDataPayload {
    jobId: string
}


export interface ProposalAcceptOrRejectDTO {
    contractStatus: "Accepted" | "Rejected",
    overallRejectionReason?: string,
    sourceId: string
}





export interface ProposalDetailDTO {
    id: string
    sourceId: string
    clientId: string
    designerId: string
    sourceName: string
    totalArea: number,
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

export interface ProposalServiceItemDTO {
    serviceName: string
    order: number
    price: number
    executionPrice: number
    status: ServiceStatus
    rejectionReason?: string
    versions: AllVersion[]
    currentVersion: number
    revisionsUsed: number
    expectedDeliveryDate: string
    actualDeliveryDate?: string
    paymentStatus: PaymentStatus
    paidAt?: string
}

export interface VersionDTO {
    serviceOrder: number
    versionId: string,
    images: string[]
    status: VersionStatus,
    rejectionReason?: string
}

export type VersionStatus = "Pending" | "Rejected" | "Approved"



export interface AllVersion {
    versionNumber: number
    versionData: VersionDTO
}

export interface ProposalAcceptOrRejectDTO {
    contractStatus: "Accepted" | "Rejected",
    overallRejectionReason?: string,
    sourceId: string
}


export interface ReviewsLIST {
    comment: string,
    rating: number
    userName: string
    profileImage?: string
    createdAt: string,
}

export interface ReviewPayload {
    rating: number;
    comment: string;
    sourceId: string
}

export interface ReviewFilters {
    designerId: string,
    page: number
}

export type ReviewPayloadFields = Omit<ReviewPayload, "sourceId">

export type MessageRole = 'Customer' | 'Designer'

export interface Message {
    id: string,
    activeJobId: string,
    senderId: string,
    senderRole: MessageRole,
    content: string,
    createdAt: string
}




export interface ServiceItemDTO {
    serviceName: string
    order: number
    price: number
    executionPrice: number
    expectedDeliveryDate: Date | string
}

export interface UpdateProposalDTO {
    proposalId: string
    sourceId: string
    drawingFeePerSqFt: number
    expectedCompletionDate: Date | string
    siteVisitingNeeded: boolean
    expectedSiteVisitingDate?: Date | string
    services: ServiceItemDTO[]
}


export interface ProposalDetailsResponse {
    id: string
    sourceId: string
    drawingFeePerSqFt: number
    expectedCompletionDate: string
    siteVisitingNeeded: boolean
    expectedSiteVisitingDate?: string
    services: {
        serviceName: string
        order: number
        price: number
        executionPrice: number
        expectedDeliveryDate: string
    }[]

    jobDetails: {
        minPrice: number
        maxPrice: number
        timeLine: string
        services: string[]
        totalArea: number
        unit: "ft" | "m"
    }
}