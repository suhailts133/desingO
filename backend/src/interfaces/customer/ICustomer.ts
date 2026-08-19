import type mongoose from "mongoose";
import type { ImageUploadResult } from "../base/IImageUpload";
import type { IUser } from "../auth/IUser";

export interface IRoomMeasurement {
    spaceType: string;
    length: string;
    width: string;
    ceilingHeight?: string;
    unit: string
    notes?: string;
}

export type ProjectType = "Renovation" | "New_Build";
export type JobStatus = "Pending" | "Ongoing" | "Closed" | "Rejected" | "Accepted"
export type AreaUnit = "ft" | "m"
export type RenovationLevel = "DECOR_ONLY" | "ROOMS_UPGRADE" | "COMPLETE_MAKEOVER";
export type VastuPreference = "STRICT" | "BASIC" | "NOT_REQUIRED";
export type ConstructionStage = "PLANNING" | "UNDER_CONSTRUCTION" | "BARE_SHELL_READY";
export type DimensionUnit = "FT" | "INCH" | "CM" | "MM";
export type Source_type = "JOB_REQUEST" | "DIRECT_HIRE"

export interface IHouseholdProfile {
    adultsCount: number;
    kidsCount: number;
    seniorsCount: number;
    hasPets: boolean;
    petDetails?: string;
}

export interface IRenovationDetails {
    level: RenovationLevel;
    propertyAgeYears: string;
    livingInDuringRenovation: boolean;
}

export interface INewBuildDetails {
    stage: ConstructionStage;
    vastuCompliantRequired: boolean;
};


export interface IItemDimensions {
    length: number;
    width: number;
    height?: number;
    unit: DimensionUnit;
}



export interface IJobRequest {
    id: string;
    userId: mongoose.Types.ObjectId
    designerId?: mongoose.Types.ObjectId
    designId?: mongoose.Types.ObjectId
    projectTitle: string;
    rejectionReason?:string
    propertyType: string;
    projectType: ProjectType
    sourceType: Source_type
    designStyles: string[];
    preferredMaterials: string[]
    householdProfile: IHouseholdProfile;
    newbuildDetails: INewBuildDetails
    renovationDetails: IRenovationDetails
    city: string;
    district: string;
    state: string;
    pincode: string;
    phone: string;

    totalCarpetArea: number;
    areaUnit: AreaUnit;
    selectedRooms: string[];

    floorPlans: ImageUploadResult[];
    requiresSiteVisitMeasurement: boolean;
    timeline: string;
    minBudget: number;
    maxBudget: number;
    description: string;
    status: JobStatus
    createdAt: Date,
    services: string[]
    referenceImages: ImageUploadResult[]
}

export type IJobRequestPopulated = Omit<IJobRequest, "userId" | "designerId"> & {
    userId: IUser
    designerId: IUser
}

export type IJobRequestCustomerPopulated = Omit<IJobRequest, "userId"> & {
    userId: IUser
}


export type ICreateJobRequest = Omit<IJobRequest, "id" | "userId" | "status" | "designerId" | "designId"> & {
    designId?: string
    designerId?: string
}



export interface IBid {
    timeLine: string
    amount: number,
    description: string
}


export interface IHireDesigner {
    id: string
    projectTitle: string;
    userId: mongoose.Types.ObjectId
    designerId: mongoose.Types.ObjectId
    designId: mongoose.Types.ObjectId
    spaceType: string,
    length: string;
    width: string;
    minBudget: number;
    maxBudget: number;
    ceilingHeight: string;
    unit: "ft" | "m"
    notes: string;
    status: "Accepted" | "Rejected" | "Pending",
    rejectionReason?: string
    services: string[]
    timeLine: string,
    createdAt: Date,
    expiresAt: Date
}

export type HireDesignerPayload = {
    designId: string;
    length: string;
    width: string;
    ceilingHeight: string;
    unit: "ft" | "m";
    notes: string;
    services: string[];
    timeLine: string;
};



export interface IActiveJob {
    id: string
    userId: mongoose.Types.ObjectId
    designerId: mongoose.Types.ObjectId
    sourceType: 'jobRequest' | 'direct_hire'
    sourceId: mongoose.Types.ObjectId
    sourceName: string
    status: 'Active' | 'Completed' | 'Cancelled'
    proposalStatus: "NOT_CREATED" | "CREATED" | "REJECTED"
    startedAt: Date
    completedAt?: Date
    cancelledAt?: Date
    createdAt: Date
}

