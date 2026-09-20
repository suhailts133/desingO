

export interface HireDesignerFilter {
    page?: string,
    sort?: "asc" | "desc",
    startDate?: string,
    endDate?: string,
}

export interface AcceptOrRejectHireDesigner {
    status: "Accepted" | "Rejected"
    rejectionReason?: string
    requestId: string
}

export type AcceptOrRejectHireDesignerDTO = Omit<AcceptOrRejectHireDesigner, "requestId">

