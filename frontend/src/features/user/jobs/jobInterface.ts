export interface RoomMeasurement {
    spaceType: { value: string; label: string };
    length: string;
    width: string;
    ceilingHeight: string;
    unit: { value: string; label: string };
    notes: string;
}

export interface IJobRequest {
    projectTitle: string;
    propertyType: { value: string; label: string }
    designStyles: { value: string; label: string }[];
    city: string;
    district: string;
    state: string;
    phone: string;
    timeline: { value: string; label: string };
    budget: string;
    description: string;
    rooms: RoomMeasurement[];
}


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
    city: string;
    state: string;
    district: string;
    phone: string;
    timeline: string;
    budget: string;
    description: string;
    rooms: RoomMeasurementPayload[];
}

export interface JobRequestDetailDTO extends IJobRequestPayload {
    name: string,
    createdAt: string,
    userCreatedAt: string,
    status: JobStatus,
    id:string
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
    price: string
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