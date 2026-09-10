import type { Tone } from "../../../shared/table/StatusBadge";
import type { ColumnDef } from "../../../shared/table/TableHeader";

export interface AdminUserFilter {
  debouncedName?: string;
  role: "All" | "Customer" | "Designer";
  status: "All" | "Active" | "Blocked";
}

export interface AdminUserQueryParams extends AdminUserFilter {
  page: number;
}




export interface AdminDesignerVerificationFilter {
  name?: string,
  status: "All" | "Pending" | "Approved" | "Rejected"
}

export interface AdminDesignerQueryParams {
  debouncedName?: string,
  status: "All" | "Pending" | "Approved" | "Rejected"
  page: number;
}


export interface AdminUsersResponseDTO {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_blocked: boolean;
  wallet: number;
  profileImage?: string;
  joinedAt: string;
}

export interface ToggleStatusPayload extends AdminUserToggleStatusResposne {
  id: string,
}

export interface AdminUserToggleStatusResposne {
  is_blocked: boolean
}

export type Role = "Admin" | "Designer" | "Customer";


export const userColumns: ColumnDef<AdminUsersResponseDTO>[] = [
  { key: "full_name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "joinedAt", label: "Joined" },
  { key: "role", label: "Role" },
  { key: "status" as keyof AdminUsersResponseDTO & string, label: "Status" }, 
  { key: "view" as keyof AdminUsersResponseDTO & string, label: "View" },
];


export const roleTone: Record<Role, Tone> = {
    Admin: "success",
    Designer: "warning",
    Customer: "info",
};