import type { Tone } from "../../../shared/table/StatusBadge";
import type { ColumnDef } from "../../../shared/table/TableHeader";

export type Status = "Pending" | "Rejected" | "Approved"
export interface AdminDesignersResponseDTO {
    id: string
    full_name: string,
    status: Status,
    createdAt: string
}
type GovtId = "aadhar_card" | "driving_licence"

export interface AdminDesignerEducation {
    institutionName: string;
    courseName: string;
    completionYear: string;
    certification: string
}
export interface AdminDesignerWorkExperience {
    companyName: string;
    role: string;
    yearsOfExperience: string;
    proof: string;
}


export interface AdminDesignerRequestResponseDTO {
    id: string;
    full_name: string;
    userId: string;
    status: Status;
    govtIdType: GovtId;
    govtIdImage: string;
    Portfolio: string;
    education: AdminDesignerEducation[];
    workExperience: AdminDesignerWorkExperience[];
    rejectionReason: string
    bio: string
}


export interface AdminDesignerApprovalDTO {
    status: "Approved" | "Rejected",
    rejectionReason?: string,
    email: string,
    name: string
}

export interface AdminDesignerApprovalPayload {
    id:string
    status: "Approved" | "Rejected",
    rejectionReason?: string,
}


export interface AdminDesignerStatus{
    status:Status
}

export interface AdminDesignerReject{
    rejectionReason:string
}

export const designerVerificationColumns: ColumnDef<AdminDesignersResponseDTO>[] = [
    { key: "full_name", label: "Name" },
    { key: "createdAt", label: "Applied On" },
    { key: "status", label: "Status" },
    { key: "view" as keyof AdminDesignersResponseDTO & string, label: "View" },
];

export const designerVerificationStatusTone: Record<Status, Tone> = {
    Approved: "success",
    Rejected: "error",
    Pending: "warning",
};
