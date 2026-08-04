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
    designId:string
}


export interface HireDesignerRequests {
    id: string,
    userName: string,
    profileImage?: string,
    length: string;
    width: string;
    ceilingHeight?: string;
    unit: string
    notes?: string;
    status: "Accepted" | "Rejected" | "Pending",
    rejectionReason?: string
    services: string[],
    createdOn: string
    timeLine: string
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

export interface IJobRequest {
    services: { value: string; label: string }[];
    projectTitle: string;
    propertyType: { value: string; label: string }
    designStyles: { value: string; label: string }[];
    city: string;
    district: string;
    state: string;
    phone: string;
    timeline: { value: string; label: string };
    minBudget: number;
    maxBudget: number;
    description: string;
    rooms: RoomMeasurement[];
    refrenceImages: {
        file: File[];
    }[];
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

export interface JobRequestDetailDTO extends IJobRequestPayload {
    name: string,
    createdAt: string,
    userCreatedAt: string,
    status: JobStatus,
    id: string
}


export interface JobsQueryParms {
    page?: number,
    designStyles?: { label: string, value: string }[] | null
    propertyTypes?: { label: string, value: string }[] | null
    timeLines?: { label: string, value: string }[] | null
    sortBy?: { label: string, value: string } | null
}





export type JobStatus = "Pending" | "Closed" | "Ongoing"

export interface JobsResponseDTO {
    id: string
    projectTitle: string,
    propertyType: string,
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

