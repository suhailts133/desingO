export interface GetMyHireDesignerRequestResponseDTO {
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


export interface MyHireDesignerFilter {
    page?: number,
    sort?: "asc" | "desc",
    startDate?: string,
    endDate?: string,
    
}
