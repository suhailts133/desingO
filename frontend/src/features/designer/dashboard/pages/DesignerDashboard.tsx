import { useGetDesignerDashboardQuery, useGetMyRecentTransactionQuery } from "../dashboardEndpoints"
import DesignerStatsOverview from "../component/DesignerStatsOverview"
import PendingProposalsSection from "../component/PendingProposalsSection"

import { useDecodeAccessToken } from "../../../../helpers/decodeAccessToken"
import OngoingProposalsSection from "../../../../shared/dashboard/OngoingProposalsSection"
import OngoingDisputesSection from "../../../../shared/dashboard/OngoingDisputesSection"
import TransactionHistorySection from "../../../../shared/dashboard/TransactionHistorySection"

export default function DesignerDashboard() {
    const { data, error, isLoading } = useGetDesignerDashboardQuery()
    const {
        data: transactionData,
        error: transactionError,
        isLoading: isTransactionLoading,
} = useGetMyRecentTransactionQuery()

    const dashboardData = data?.data
    const transactions = transactionData?.data
    const { role } = useDecodeAccessToken()

    if (isLoading || isTransactionLoading) {
        return <div className="p-6 text-sm text-soft-black/50">Loading dashboard…</div>
    }

    if (error || !dashboardData || !transactions) {
        return <div className="p-6 text-sm text-error">Couldn't load your dashboard. Please try again.</div>
    }

    if (transactionError) {
        return <div className="p-6 text-sm text-error">Couldn't load your transactions. Please try again.</div>
    }

    return (
        <div className="w-full max-w-7xl flex flex-col gap-8">
            <DesignerStatsOverview data={dashboardData} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <PendingProposalsSection proposals={dashboardData.pendingProposals} />
                <OngoingDisputesSection disputes={dashboardData.ongoingDisputes} role={role} />
                <OngoingProposalsSection proposals={dashboardData.ongoingProposals} role={role} />
            </div>

            <TransactionHistorySection transactions={transactions} />
        </div>
    )
}