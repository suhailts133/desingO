import type { ImageUploadResult } from "../../interfaces/base/IImageUpload"
import type { IHouseholdProfile, IJobRequest, INewBuildDetails, IRenovationDetails, Source_type } from "../../interfaces/customer/ICustomer"

export type JobStatus = "Pending" | "Closed" | "Ongoing" | "Rejected" |"Accepted"

export interface JobsResponseDTO {
    id: string
    projectTitle: string,
    propertyType: string,
    description: string,
    timeLine: string,
    sourceType: Source_type
    status: JobStatus
    rooms: number
    city: string
    district: string
    state: string
    minBudget: number
    maxBudget: number
}

export interface EditJobRequest {

    sourceType: "JOB_REQUEST" | "DIRECT_HIRE";
    designerId?: string;
    designId?: string;
    projectType: "Renovation" | "New_Build";
    projectTitle: string;
    propertyType: string;
    description: string;
    renovationDetails?: IRenovationDetails;
    newbuildDetails?: INewBuildDetails;
    totalCarpetArea: number;
    areaUnit: "ft" | "m";
    selectedRooms: string[];
    requiresSiteVisitMeasurement: boolean;
    oldFloorPlans?: ImageUploadResult[];
    services: string[];
    designStyles: string[];
    preferredMaterials: string[];
    oldReferences?: ImageUploadResult[];
    householdProfile: IHouseholdProfile;
    state: string;
    district: string;
    city: string;
    pincode: string;
    phone: string;
    timeline: string;
    minBudget: number;
    maxBudget: number;
}


export type EditJobRepoData = Omit<EditJobRequest, "oldReferences" | "oldFloorPlans">

export interface HireDesignerDTO {
    id: string,
    userId: string
    userName: string,
    profileImage?: string,
    totalArea: number
    rooms: number
    areaUnit: "ft" | "m";
    projectTitle: string
    maxBudget: number
    minBudget: number
    createdAt: string
    timeLine: string
    rejectionReason?: string
    projectType: "Renovation" | "New_Build";
    status: "Pending" | "Ongoing" | "Closed" | "Rejected" | "Accepted"
}


export type JobsCommonResponseDTO = Omit<JobsResponseDTO, "status"> & {
    name: string,
    createdAt: string
    designStyles: string[]
}


export type JobDetailResponseDTO = Omit<IJobRequest, "designId" | "userId" | "designerId" | "createdAt"> & {
    userId: string;
    userName: string;
    designerId?: string;
    designId?: string;
    designerName?: string;
    createdAt: string;

};


export interface JobFilter {
    page?: string,
    designStyles?: string
    propertyTypes?: string
    timeLines?: string
    sortBy?: string
}
