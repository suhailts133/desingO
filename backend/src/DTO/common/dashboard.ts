import type { Source_type } from "../../interfaces/customer/ICustomer"
import type { DisputeStatus, ProposalPaymentStatus, ProposalServiceStatus } from "../../interfaces/proposal/IProposal"



export interface CustomerDashboardDTO {
    userId: string
    name: string
    wallet: number
    totalJobCount:number
    totalMoneySpent: number
    activJobCount: number
    moneyHeld: number
    completedJobCount: number
    ongoingDisputes: OngoingDisputeDTOs[]
    ongoingProposals: OngoingProposalDTOs[]
}




export interface DesignerDashboardDTO {
    userId: string
    name: string
    rating: number
    wallet: number
    activJobCount: number
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
    sourceType: Source_type
    jobName: string
    activeJobId: string
    jobId: string;
    serviceName: string
    status: ProposalServiceStatus
    paymentStatus: ProposalPaymentStatus
}