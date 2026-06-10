export enum ServiceStatus {
    LOCKED = "Locked",
    OPEN = "Open",
    IN_PROGRESS = "In Progress",
    UPLOADED = "Uploaded",
    REDO = "Redo",
    COMPLETED = "Completed"
}

export enum ServicePaymentStatus {
    PENDING = "Pending",
    PAID = "Paid",
    REFUNDED = "Refunded"
}

export enum Payment_Status {
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    REFUNDED = "refunded",
}

export enum EscrowStatus {
    HELD = "Held",
    RELEASED = "Released",
    REFUNDED = "Refunded",
    DISPUTED = "Disputed"
}

export enum CONTRACT_STATUS {
    SENT = "Sent",
    ACCEPTED = "Accepted",
    REJECTED = "Rejected",
    ONGOING = "Ongoing",
    COMPLETED = "Completed",
    DISPUTED = "Disputed",
    EXPIRED = "Expired"
}

export enum DisputeStatus {
    OPEN = "Open",
    UNDER_REVIEW = "Under Review",
    RESOLVED = "Resolved",
    ESCALATED = "Escalated"
}


export const FIRST_SERVICE_ORDER_NUMBER = 1



export enum VERSION_STATUS {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected",
}