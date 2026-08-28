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
  full_name: string,
  email: string,
  id: string,
  role: string,
  is_blocked: boolean,
  joinedAt: string
}


export interface ToggleStatusPayload extends AdminUserToggleStatusResposne {
  id: string,
}

export interface AdminUserToggleStatusResposne {
  is_blocked: boolean
}