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

export enum DISPUTE_STATUS {
    OPEN = "Open",
    UNDER_REVIEW = "Under Review",
    RESOLVED = "Resolved",
    REDO = "Redo",
    AWAITING_CONFIRMATION = "Awaiting Confirmation"
}


export enum USER_TYPE {
    CUSTOMER = "Customer",
    DESIGNER = "Designer",
}
export enum DISPUTE_RESOLVED_BY {
    ADMIN = "Admin",
    MUTUAL = "Mutual",
}


export const FIRST_SERVICE_ORDER_NUMBER = 1



export enum VERSION_STATUS {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected",
}


export enum DISPUTE_SOLUTION {
    FULL_REFUND = "Full_Refund",
    REFUND = "Refund",
}