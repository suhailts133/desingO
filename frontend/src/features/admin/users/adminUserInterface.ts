export interface AdminUserFilter {
  debouncedName?: string;
  role: "All" | "Customer" | "Designer";
  status: "All" | "Active" | "Blocked";
}

export interface AdminUserQueryParams extends AdminUserFilter {
  page: number;
}

export interface AdminDesignerVerificationFilter {
  name?: string;
  status: "All" | "Pending" | "Approved" | "Rejected";
}

export interface AdminDesignerQueryParams {
  debouncedName?: string;
  status: "All" | "Pending" | "Approved" | "Rejected";
  page: number;
}

export interface AdminUsersResponseDTO {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_blocked: boolean;
  profileImage?: string;
  joinedAt: string;
}

export interface ToggleStatusPayload extends AdminUserToggleStatusResposne {
  id: string;
}

export interface AdminUserToggleStatusResposne {
  is_blocked: boolean;
}

export type Role = "Admin" | "Designer" | "Customer";

export type IAuthProvider = "Google" | "Local";
export interface AdminUserDetailDTO {
  id: string;
  full_name: string;
  email: string;
  authProvider: IAuthProvider;
  wallet: number;
  activeJobCount: number;
  designCount?: number;
  rating?: number;
  role: string;
  is_blocked: boolean;
  profileImage?: string;
  joinedAt: string;
}
