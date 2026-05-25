import type { IUser } from "../../interfaces/auth/IUser.js";
import type { IHireDesigner } from "../../interfaces/customer/ICustomer.js";
import type { IDesign } from "../../interfaces/designer/IDesigner.js";

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

export interface getMyHireDesignerRequestResponseDTO {
    id: string,
    designerId: string,
    spaceType: string,
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

export type CreateHireDesignerDTO = Omit<IHireDesigner, "id" | "status" | "rejectionReason" | "userId" | "designerId" | "designId"> & {
    userId: string;
    designerId: string;
    designId: string;
};

