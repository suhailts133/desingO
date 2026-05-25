import mongoose from "mongoose";
import type { ImageUploadResult } from "../base/IImageUpload.js";


export type ServiceStatus = "Locked" | "Open" | "In Progress" | "Uploaded" | "Redo" | "Completed"

export type PaymentStatus = "Pending" | "Paid" | "Refunded"

export type EscrowStatus = "Held" | "Released" | "Refunded" | "Disputed"

export type ContractStatus = "Sent" | "Accepted" | "Rejected" | "Ongoing" | "Completed" | "Disputed" | "Expired"

export type DisputeStatus = "Open" | "Under Review" | "Resolved" | "Escalated"


export interface IEscrow {
    amountHeld: number;
    platformCommission: number;
    designerPayout: number;
    status: EscrowStatus;
    stripeTransferId?: string;
    releasedAt?: Date;
}

export interface IServiceReview {
    rating: number;
    comment: string;
    deliveredOnTime: boolean;
    revisionsNeeded: number;
    reviewedAt: Date;
}


export interface IDispute {
    raisedBy: "client" | "designer";
    serviceOrder: number;
    reason: string;
    evidence: ImageUploadResult[];
    status: DisputeStatus;
    resolution?: string;
    resolvedBy?: "admin" | "mutual";
    createdAt: Date;
    resolvedAt?: Date;
}

export interface IServiceItem {
    serviceName: string;
    order: number;
    price: number;
    executionPrice: number;
    status: ServiceStatus;
    rejectionReason?: string;
    uploadedImages: ImageUploadResult[];
    revisionLimit: number;
    revisionsUsed: number;
    expectedDeliveryDate: Date;
    actualDeliveryDate?: Date;
    paymentStatus: PaymentStatus;
    stripePaymentIntentId?: string;
    paidAt?: Date;
    escrow?: IEscrow;
    review?: IServiceReview;
}

export interface IProposal {
    id: string;
    sourceId: mongoose.Types.ObjectId
    sourceType: "jobRequest" | "directHire"
    clientId: mongoose.Types.ObjectId;
    designerId: mongoose.Types.ObjectId;
    drawingFeePerSqFt: number;
    totalDrawingFee: number;
    services: IServiceItem[];
    totalContractValue: number;
    totalExecutionFee: number;
    advanceFee: number;
    advancePaid: boolean;
    advancePaidAt?: Date;
    advanceStripePaymentIntentId?: string;
    contractStatus: ContractStatus;
    overallRejectionReason?: string;
    clientAcceptedAt?: Date;
    designerAcceptedAt?: Date;
    expectedCompletionDate: Date;
    actualCompletionDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}