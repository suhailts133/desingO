export interface AdminUsersResponseDTO {
    full_name: string,
    email: string,
    id: string,
    role: string,
    is_blocked: boolean,
    joinedAt: string
}

export interface AdminUserToggleStatusDTO{
    is_blocked:boolean
}

export interface Pagination{
    total:number,
    totalPages:number
}

export interface UserFilterDTO {
    name?: string,
    role?: string,
    is_blocked?: string,
    page?: number
    sortByName?:string
}

export interface DesignerFilterDTO {
    debouncedName?: string,
    status?: Status,
    page?:number
}

type Status = "Pending" | "Approved" | "Rejected"


type GovtId = "aadhar_card" | "driving_licence"

export interface AdminDesignerEducation {
    institutionName: string;
    courseName: string;
    completionYear: string;
    certification:string
}
export interface AdminDesignerWorkExperience {
    companyName: string;
    role: string;
    yearsOfExperience: string;
    proof:string;
}


export interface AdminDesignerRequestResponseDTO{
    id:string;
    full_name:string;
    userId:string;
    status:Status;
    govtIdType:GovtId;
    govtIdImage:string;
    Portfolio:string;
    education:AdminDesignerEducation[];
    workExperience:AdminDesignerWorkExperience[];
    rejectionReason:string
    bio:string
}

export interface AdminDesignerApprovalDTO{
    status:"Approved" | "Rejected",
    rejectionReason?:string,
    email:string,
    name:string
    userId:string
}


export interface AdminDesignerApprovalRequestDTO {
    status: "Approved" | "Rejected",
    rejectionReason?: string,
}

export interface AdminDesignerStatusDTO{
    status: "Approved" | "Rejected" | "Pending"
}



export interface AdminDesignersResponseDTO {
    id: string
    full_name: string,
    status: Status,
    createdAt: string
}
