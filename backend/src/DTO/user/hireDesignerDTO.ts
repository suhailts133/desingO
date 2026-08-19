import type { IUser } from "../../interfaces/auth/IUser";
import type { IHireDesigner } from "../../interfaces/customer/ICustomer";
import type { IDesign } from "../../interfaces/designer/IDesigner";

export type HireDesignerPopulatedALL = Omit<IHireDesigner, "userId" | "designerId" | "designId"> & {
    designId: IDesign,
    userId: IUser
}

export type HireDesignerPopulateUser = Omit<IHireDesigner, "userId"> & {
    userId: IUser
}


export interface HireDesignerFilter {
    page?: string,
    sort?: "asc" | "desc",
    startDate?: string,
    endDate?: string,
}

export interface getHireDesignerPerDesignResponseDTO {
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


export interface UpdateHireDesignerRequestDTO {
    length: string;
    width: string;
    ceilingHeight: string;
    unit: "ft" | "m";
    spaceType: string;
    notes: string;
    services: string[];
    timeLine: string;
    status: "Accepted" | "Rejected" | "Pending";
    rejectionReason?: string;
}


export type UpdateHireDesignerRepoInput = Partial<Omit<IHireDesigner, "id" | "userId" | "designerId" | "createdAt">>;

export interface AcceptOrRejectHireDesigner {
    status: "Accepted" | "Rejected"
    rejectionReason?: string
    requestId: string
}

export type AcceptOrRejectHireDesignerDTO = Omit<AcceptOrRejectHireDesigner, "requestId">




export interface getMyHireDesignerRequestResponseDTO {
    id: string,
    length: string;
    width: string;
    ceilingHeight?: string;
    unit: string
    notes?: string;
    status: "Accepted" | "Rejected" | "Pending",
    rejectionReason?: string
    services: string[]
    coverImage: string
    designName: string,
    designId: string,
    createdOn: string
    timeLine: string
}

export type CreateHireDesignerDTO = {
    userId: string;
    designerId: string;
    designId: string;
    projectTitle: string
    minBudget: number;
    maxBudget: number;
    length: string;
    width: string;
    ceilingHeight: string;
    unit: "ft" | "m";
    notes: string;
    services: string[];
    timeLine: string;
    status: "Accepted" | "Rejected" | "Pending";
};
