import type { ImageUploadResult } from "../designer/profile/designerProfileInterface"

export type ServiceStatus = "Locked" | "Open" | "In Progress" | "Uploaded" | "Redo" | "Completed"

export type PaymentStatus = "Pending" | "Paid" | "Refunded"

export type EscrowStatus = "Held" | "Released" | "Refunded" | "Disputed"

export type ContractStatus = "Sent" | "Accepted" | "Rejected" | "Ongoing" | "Completed" | "Disputed" | "Expired"

export type DisputeStatus = "Open" | "Under Review" | "Resolved" | "Escalated"




export interface ProposalDetailDTO {
    id: string
    sourceId: string
    sourceType: "jobRequest" | "direct_hire"
    clientId: string
    designerId: string
    sourceName: string
  

    drawingFeePerSqFt: number
    totalDrawingFee: number
    totalExecutionFee: number
    advanceFee: number
    totalContractValue: number
    advancePaid: boolean
    advancePaidAt?: string


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
    revisionLimit: number
    revisionsUsed: number
    expectedDeliveryDate: string
    actualDeliveryDate?: string
    paymentStatus: PaymentStatus
    paidAt?: string
}


