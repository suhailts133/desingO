import type { OngoingDisputeDTOs, OngoingProposalDTOs } from "../../designer/dashboard/dashboardInterface"

export interface CustomerDashboardDTO {
    userId: string
    name: string
    wallet: number
    totalMoneySpent: number
    totalJobCount:number
    activJobCount: number
    moneyHeld: number
    completedJobCount: number
    ongoingDisputes: OngoingDisputeDTOs[]
    ongoingProposals: OngoingProposalDTOs[]
}

