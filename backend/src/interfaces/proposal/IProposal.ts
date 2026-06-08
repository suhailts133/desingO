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



export interface IReview{
    id:string,
    comment:string,
    rating:number,
    userId:mongoose.Types.ObjectId 
    designerId:mongoose.Types.ObjectId
    userName:string,
    profileImage:string,
    jobId:mongoose.Types.ObjectId
    createdAt:Date,
}
export interface IServiceItem {
    serviceName: string;
    order: number;
    price: number;
    executionPrice: number;
    status: ServiceStatus;
    rejectionReason?: string;
    uploadedImages: ImageUploadResult[];
    currentVersion: number;
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
    sourceType: "jobRequest" | "direct_hire",
    sourceName:string
    clientId: mongoose.Types.ObjectId;
    designerId: mongoose.Types.ObjectId;
    drawingFeePerSqFt: number;
    totalDrawingFee: number;
    services: IServiceItem[];
    totalContractValue: number;
    totalExecutionFee: number;
    contractStatus: ContractStatus;
    overallRejectionReason?: string;
    clientAcceptedAt?: Date;
    expectedCompletionDate: Date;
    actualCompletionDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type VersionStatus = "Pending_Review" | "Rejected" | "Approved"

export interface IServiceVersion {
    id: string;
    proposalId: mongoose.Types.ObjectId;
    serviceOrder: number;
    version: number;
    images: ImageUploadResult[];
    status: VersionStatus;
    rejectionReason?: string;
    uploadedAt: Date;
}