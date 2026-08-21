import mongoose from "mongoose";
import type { ImageUploadResult } from "../base/IImageUpload.js";


export type ProposalServiceStatus = "Locked" | "Open" | "In Progress" | "Uploaded" | "Redo" | "Completed"

export type ProposalPaymentStatus = "Pending" | "Paid" | "Refunded"

export type EscrowStatus = "Held" | "Released" | "Refunded" | "Disputed"

export type ContractStatus = "Sent" | "Accepted" | "Rejected" | "Ongoing" | "Completed" | "Disputed" | "Expired"

export type DisputeStatus = "Open" | "Under Review" | "Resolved" | "Redo" | "Awaiting Confirmation"


export interface IServiceReview {
    rating: number;
    comment: string;
    deliveredOnTime: boolean;
    revisionsNeeded: number;
    reviewedAt: Date;
}



export interface IReview {
    id: string,
    comment: string,
    rating: number,
    userId: mongoose.Types.ObjectId
    designerId: mongoose.Types.ObjectId
    userName: string,
    profileImage: string,
    jobId: mongoose.Types.ObjectId
    createdAt: Date,
}


export interface IEscrow {
    amountHeld: number;
    platformCommission: number;
    designerPayout: number;
    status: EscrowStatus;
    releasedAt?: Date;
}

export interface IServiceItem {
    serviceName: string;
    order: number;
    price: number;
    executionPrice: number;
    status: ProposalServiceStatus;
    uploadedImages: ImageUploadResult[];
    currentVersion: number;
    versionId: mongoose.Types.ObjectId;
    expectedDeliveryDate: Date;
    actualDeliveryDate?: Date;
    paymentStatus: ProposalPaymentStatus;
    stripePaymentIntentId?: string;
    paidAt?: Date;
    escrow?: IEscrow;
    review?: IServiceReview;
}


export interface IProposal {
    id: string;
    sourceId: mongoose.Types.ObjectId
    sourceType: "jobRequest" | "direct_hire",
    sourceName: string
    clientId: mongoose.Types.ObjectId;
    designerId: mongoose.Types.ObjectId;
    disputeId: string;
    drawingFeePerSqFt: number;
    totalDrawingFee: number;
    services: IServiceItem[];
    totalContractValue: number;
    totalExecutionFee: number;
    contractStatus: ContractStatus;
    overallRejectionReason?: string;
    platformFee: number;
    remainingPlatformFee: number;
    clientAcceptedAt?: Date;
    totalArea: number
    unit: "ft" | "m"
    siteVisitingNeeded: boolean,
    expectedSiteVisitingDate?: Date
    floorPlan?: ImageUploadResult[]
    expectedCompletionDate: Date;
    actualCompletionDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type VersionStatus = "Pending" | "Rejected" | "Approved"

export interface IServiceVersion {
    id: string;
    proposalId: mongoose.Types.ObjectId;
    sourceId: mongoose.Types.ObjectId;
    serviceOrder: number;
    version: number;
    images: ImageUploadResult[];
    status: VersionStatus;
    rejectionReason?: string;
    createdAt: Date;
}