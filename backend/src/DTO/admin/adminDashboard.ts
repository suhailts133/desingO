import type { DisputeStatus } from "../../interfaces/proposal/IProposal"

export interface AdminDashboardDTO {
    activeUsersCount: number,
    activeJobCount: number,
    totalCommision: number
    disputes: AdminOngoingDisputeDTOs[]
    designerVerificationRequests: PendingVerificationRequests[]
}

export type PendingStatusType = "Pending"

export interface PendingVerificationRequests {
    id: string
    email: string
    name: string
    status: PendingStatusType
}
export interface AdminOngoingDisputeDTOs {
    id: string
    type: string
    reason: string
    status: DisputeStatus
}