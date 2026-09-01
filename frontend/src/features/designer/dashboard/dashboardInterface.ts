import type { ProposalServiceStatus } from "../../admin/disputes/adminDisputeInterface"
import type { DisputeStatus } from "../../proposal/proposalInterface"
import type { Source_type } from "../../user/jobs/jobInterface"


export type ProposalPaymentStatus = "Pending" | "Paid" | "Refunded"

export interface DesignerDashboardDTO {
    userId: string
    name: string
    activJobCount: number
    rating: number
    wallet: number
    moneyHeld: number
    completedJobCount: number
    designCount: number
    pendingProposals: PendingProposalDTOs[]
    ongoingDisputes: OngoingDisputeDTOs[]
    ongoingProposals: OngoingProposalDTOs[]

}

export interface PendingProposalDTOs {
    sourceId: string,
    activeJobId: string
    sourceType: 'jobRequest' | 'direct_hire'
    jobName: string
    proposalStatus: "NOT_CREATED" | "CREATED" | "REJECTED"
}

export interface OngoingDisputeDTOs {
    proposalId: string
    type: string
    reason: string
    status: DisputeStatus
    sourceType: 'jobRequest' | 'direct_hire'
    activeJobId: string
    sourceId: string,
}

export interface OngoingProposalDTOs {
    proposalId: string
    activeJobId: string
    sourceType: Source_type
    jobName: string
    jobId: string;
    serviceName: string
    status: ProposalServiceStatus
    paymentStatus: ProposalPaymentStatus
}