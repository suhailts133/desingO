import type { Tone } from "../../../shared/table/StatusBadge";
import type { ColumnDef } from "../../../shared/table/TableHeader";
import type { DisputeStatus } from "../../proposal/proposalInterface";
import type { AllDisputeAdminDTO } from "./adminDisputeInterface";

export const disputeStatusTone: Record<DisputeStatus, Tone> = {
    Open: "warning",
    "Under Review": "info",
    Resolved: "success",
    Redo: "error",
    "Awaiting Confirmation": "warning",
};




export const disputeColumns: ColumnDef<AllDisputeAdminDTO>[] = [
    { key: "type", label: "Type", className: "font-Jost-Semibold text-soft-black text-sm" },
    { key: "reason", label: "Reason" },
    { key: "raisedBy", label: "Raised By" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Raised On" },
    { key: "view" as keyof AllDisputeAdminDTO & string, label: "View" },
];

