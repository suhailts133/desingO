export enum ServiceStatus {
    LOCKED      = "Locked",        
    OPEN        = "Open",          
    IN_PROGRESS = "In Progress",   
    UPLOADED    = "Uploaded",      
    REDO        = "Redo",          
    COMPLETED   = "Completed"      
}

export enum PaymentStatus {
    PENDING  = "Pending",
    PAID     = "Paid",
    REFUNDED = "Refunded"
}

export enum EscrowStatus {
    HELD     = "Held",
    RELEASED = "Released",
    REFUNDED = "Refunded",
    DISPUTED = "Disputed"
}

export enum ContractStatus {
    SENT      = "Sent",        
    ACCEPTED  = "Accepted",    
    REJECTED  = "Rejected",    
    ONGOING   = "Ongoing",     
    COMPLETED = "Completed",   
    DISPUTED  = "Disputed",    
    EXPIRED   = "Expired"      
}

export enum DisputeStatus {
    OPEN         = "Open",
    UNDER_REVIEW = "Under Review",
    RESOLVED     = "Resolved",
    ESCALATED    = "Escalated"
}