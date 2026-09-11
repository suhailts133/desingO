import type { Tone } from "../../../shared/table/StatusBadge";
import type { ColumnDef } from "../../../shared/table/TableHeader";
import type { AdminUsersResponseDTO, Role } from "./adminUserInterface";

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