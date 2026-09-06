import type { Tone } from "../../../shared/table/StatusBadge";
import type { ColumnDef } from "../../../shared/table/TableHeader";
import type { DisputeStatus } from "../../proposal/proposalInterface";

export interface DisputeAdminFilters {
    page?: string,
    sort?: "asc" | "desc",
    status?: "Open" | "Under Review" | "Resolved" | "Redo" | "Awaiting Confirmation" | "All"
}


export interface AllDisputeAdminDTO {
    id: string
    raisedBy: "Customer" | "Designer";
    reason: string;
    type: string
    status: DisputeStatus;
    createdAt: string;
}

export interface DisputeSolutionDTO {
    resolution: string;
    resolutionType: string;
    refundAmount: number
    disputeId: string;
}

export interface DisputeSolutionResponseDTO extends DisputeSolutionDTO {
    status: DisputeStatus

}




export const disputeStatusTone: Record<DisputeStatus, Tone> = {
    Open: "warning",
    "Under Review": "info",
    Resolved: "success",
    Redo: "error",
    "Awaiting Confirmation": "warning",
};




export const disputeColumns: ColumnDef<AllDisputeAdminDTO>[] = [
    { key: "type", label: "Type", className:"font-Jost-Semibold text-soft-black text-sm"},
    { key: "reason", label: "Reason" },
    { key: "raisedBy", label: "Raised By" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Raised On" },
    { key: "view" as keyof AllDisputeAdminDTO & string, label: "View" },
];





export interface DisputeDetailAdminDTO {
    id: string,
    proposalId: string,
    raisedBy: "Customer" | "Designer";
    reason: string;
    type: string
    resolutionType?: string
    resolution?: string
    status: DisputeStatus;
    createdAt: string;
    evidence: string[],
    customerName: string
    designerName: string
    customerId: string
    designerId: string
    customerImage?: string
    designerImage?: string
    currentService: currentDisputedService
}
export type ProposalServiceStatus = "Locked" | "Open" | "In Progress" | "Uploaded" | "Redo" | "Completed"
export type EscrowStatus = "Held" | "Released" | "Refunded" | "Disputed"


export interface currentDisputedService {
    serviceName: string;
    order: number;
    price: number;
    executionPrice: number;
    serviceStatus: ProposalServiceStatus;
    uploadedImages?: string[];
    currentVersion: number;
    expectedDeliveryDate: string;
    actualDeliveryDate?: string;
    paidAt?: string;
    amountHeld?: number;
    platformCommission?: number;
    designerPayout?: number;
    escrowStatus?: EscrowStatus;
    releasedAt?: string;
}


export interface DisputeSolutionDTO {
    resolution: string;
    resolutionType: string;
    refundAmount: number
    disputeId: string;
}