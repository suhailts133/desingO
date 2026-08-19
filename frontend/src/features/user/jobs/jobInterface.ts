import type { ImageUploadResult } from "../../designer/profile/designerProfileInterface";

export interface RoomMeasurement {
    spaceType: { value: string; label: string };
    length: string;
    width: string;
    ceilingHeight: string;
    unit: { value: string; label: string };
    notes: string;
}

export interface HireDesignerFilter {
    page?: number,
    sort?: "asc" | "desc",
    startDate?: string,
    endDate?: string,
    designId: string
}




export interface HireDesignerFields {
    length: string;
    width: string;
    ceilingHeight: string;
    unit: string
    notes?: string;
    timeLine: string
    services: string[]
    designId: string
}
export type DirectHireFields = Omit<RoomMeasurement, "spaceType"> & {
    timeLine: { value: string; label: string },
    services: { value: string; label: string }[]
    designId: string
}
export type DirectHireFormPayload = Omit<DirectHireFields, "designId">

export interface EditRoomMeasurement {
    spaceType: string;
    length: string;
    width: string;
    ceilingHeight?: string;
    unit: string;
    notes?: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export type ProjectType = "Renovation" | "New_Build";
export type RenovationLevel = "DECOR_ONLY" | "ROOMS_UPGRADE" | "COMPLETE_MAKEOVER";
export type ConstructionStage = "PLANNING" | "UNDER_CONSTRUCTION" | "BARE_SHELL_READY";
export type AreaUnit = "ft" | "m";
export type DimensionUnit = "FT" | "INCH" | "CM" | "MM";

export interface IItemDimensions {
    length: number;
    width: number;
    height?: number;
    unit: DimensionUnit;
}


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
}
export type Source_type = "JOB_REQUEST" | "DIRECT_HIRE"
export interface IJobRequest {
    projectTitle: string;
    description: string;
    projectType: ProjectType;
    propertyType: SelectOption;
    designId?: string
    designerId?: string
    sourceType: Source_type


    renovationDetails?: IRenovationDetails;
    newbuildDetails?: INewBuildDetails;

    totalCarpetArea: number;
    areaUnit: AreaUnit;
    selectedRooms: SelectOption[];
    requiresSiteVisitMeasurement: boolean;
    floorPlans?: { file: File[] }[];

    servicePackageType: "CONCEPT" | "CONTRACTOR_READY" | "CUSTOM";
    services: SelectOption[];
    designStyles: SelectOption[];
    preferredMaterials: SelectOption[];
    householdProfile: IHouseholdProfile;
    state: string;
    district: string;
    city: string;
    pincode: string;
    phone: string;


    timeline: SelectOption;
    minBudget: number;
    maxBudget: number;

    referenceImages: { file: File[] }[];
}

export type EditJobRequestFields = Omit<IJobRequest, "refrenceImages">

export interface IBid {
    timeLine: { value: string; label: string }
    amount: number,
    description: string
}


export interface RoomMeasurementPayload {
    spaceType: string;
    length: string;
    width: string;
    unit: string;
    ceilingHeight?: string;
    notes?: string;
}

export interface IJobRequestPayload {
    projectTitle: string;
    propertyType: string;
    designStyles: string[];
    services: string[];
    city: string;
    state: string;
    district: string;
    phone: string;
    timeline: string;
    minBudget: number;
    maxBudget: number;
    description: string;
    referenceImages: ImageUploadResult[]
    rooms: RoomMeasurementPayload[];
}

export interface IHouseholdProfileDTO {
    adultsCount: number;
    kidsCount: number;
    seniorsCount: number;
    hasPets: boolean;
    petDetails?: string;
}

export interface IRenovationDetailsDTO {
    level: "DECOR_ONLY" | "ROOMS_UPGRADE" | "COMPLETE_MAKEOVER";
    propertyAgeYears: string;
    livingInDuringRenovation: boolean;
}

export interface INewBuildDetailsDTO {
    stage: "PLANNING" | "UNDER_CONSTRUCTION" | "BARE_SHELL_READY";
    vastuCompliantRequired: boolean;
}

export interface IItemDimensionsDTO {
    length: number;
    width: number;
    height?: number;
    unit: "FT" | "INCH" | "CM" | "MM";
}

export interface IReusableItemDTO {
    name: string;
    category: "FURNITURE" | "APPLIANCE" | "ART_DECOR" | "OTHER";
    dimensions: IItemDimensionsDTO;
    photoUrl?: string;
    notes?: string;
}

export interface JobRequestDetailDTO {
    id: string;
    userId: string;
    userName: string;

    designerId?: string;
    designerName?: string;
    designId?: string;
    sourceType: "JOB_REQUEST" | "DIRECT_HIRE";

    projectTitle: string;
    propertyType: string;
    projectType: "Renovation" | "New_Build";
    description: string;


    renovationDetails?: IRenovationDetailsDTO;
    newbuildDetails?: INewBuildDetailsDTO;


    totalCarpetArea: number;
    areaUnit: "ft" | "m";
    selectedRooms: string[];
    requiresSiteVisitMeasurement: boolean;
    floorPlans: ImageUploadResult[];
    referenceImages: ImageUploadResult[];


    designStyles: string[];
    preferredMaterials: string[];
    services: string[];
    reusableItems?: IReusableItemDTO[];

    householdProfile: IHouseholdProfileDTO;


    state: string;
    district: string;
    city: string;
    pincode: string;
    phone: string;

    timeline: string;
    minBudget: number;
    maxBudget: number;


    status: JobStatus;
    createdAt: string;

}
export type JobStatus = "Pending" | "Closed" | "Ongoing"

export interface JobsQueryParms {
    page?: number,
    designStyles?: { label: string, value: string }[] | null
    propertyTypes?: { label: string, value: string }[] | null
    timeLines?: { label: string, value: string }[] | null
    sortBy?: { label: string, value: string } | null
}






export interface JobsResponseDTO {
    id: string
    projectTitle: string,
    propertyType: string,
    sourceType: Source_type
    description: string,
    timeLine: string,
    status: JobStatus
    rooms: number
    city: string
    district: string
    state: string
    minBudget: number
    maxBudget: number
}

export type JobsCommonResponseDTO = Omit<JobsResponseDTO, "status"> & {
    name: string,
    createdAt: string
    designStyles: string[]
}


export interface JOBFilterForm {
    designStyles: { label: string; value: string }[] | null;
    propertyTypes: { label: string; value: string }[] | null;
    timeLines: { label: string; value: string }[] | null;
    sortBy: { label: string; value: string } | null;
}

