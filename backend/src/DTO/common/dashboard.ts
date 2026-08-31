import type { DisputeStatus, EscrowStatus, ProposalPaymentStatus, ProposalServiceStatus } from "../../interfaces/proposal/IProposal"

export interface DesignerDashboardDTO {
    userId: string
    rating: number
    wallet: number
    moneyHeld: number
    activeJobCount: number
    completedJobCount: number
    designCount: number
    pendingProposals: PendingProposalDTOs
    ongoingDisputes: OngoingDisputeDTOs
    ongoingProposals: OngoingProposalDTOs

}

export interface PendingProposalDTOs {
    sourceId: string,
    sourceType: 'jobRequest' | 'direct_hire'
    jobName: string
    proposalStatus: "NOT_CREATED" | "CREATED" | "REJECTED"
}

export interface OngoingDisputeDTOs {
    proposalId: string
    type: string
    reason: string
    status: DisputeStatus
}

export interface OngoingProposalDTOs {
    proposalId: string
    jobName: string
    jobId: string;
    serviceName: string
    status: ProposalServiceStatus
    paymentStatus: ProposalPaymentStatus
    escrowStatus: EscrowStatus
}