import type { Tone } from "../../../shared/table/StatusBadge";
import type { ColumnDef } from "../../../shared/table/TableHeader";
import type { AdminDesignersResponseDTO, Status } from "./adminDesignerVerificationInterfaces";

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
