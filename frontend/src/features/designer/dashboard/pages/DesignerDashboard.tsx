// features/designer/dashboard/page/DesignerDashboard.tsx
import { useGetDesignerDashboardQuery, useGetMyRecentTransactionQuery, useGetTopReviewsQuery } from "../dashboardEndpoints"
import DesignerStatsOverview from "../component/DesignerStatsOverview"
import PendingProposalsSection from "../component/PendingProposalsSection"

import { useDecodeAccessToken } from "../../../../helpers/decodeAccessToken"
import OngoingProposalsSection from "../../../../shared/dashboard/OngoingProposalsSection"
import OngoingDisputesSection from "../../../../shared/dashboard/OngoingDisputesSection"
import TransactionHistorySection from "../../../../shared/dashboard/TransactionHistorySection"
import TopReviewsSection from "../component/TopReviewsSection"

export default function DesignerDashboard() {
    const { data, error, isLoading } = useGetDesignerDashboardQuery()
    const {
        data: transactionData,
        error: transactionError,
        isLoading: isTransactionLoading,
    } = useGetMyRecentTransactionQuery()
    const {
        data: reviewData,
        error: reviewError,
        isLoading: isReviewLoading,
    } = useGetTopReviewsQuery()

    const dashboardData = data?.data
    const transactions = transactionData?.data
    const reviews = reviewData?.data
    const { role } = useDecodeAccessToken()

    if (isLoading || isTransactionLoading || isReviewLoading) {
        return <div className="p-6 text-sm text-text-faint">Loading dashboard…</div>
    }

    if (error || !dashboardData || !transactions) {
        return <div className="p-6 text-sm text-error">Couldn't load your dashboard. Please try again.</div>
    }

    if (transactionError) {
        return <div className="p-6 text-sm text-error">Couldn't load your transactions. Please try again.</div>
    }

    if (reviewError || !reviews) {
        return <div className="p-6 text-sm text-error">Couldn't load your reviews. Please try again.</div>
    }

    return (
        <div className="w-full max-w-7xl flex flex-col gap-8">
            <DesignerStatsOverview data={dashboardData} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <PendingProposalsSection proposals={dashboardData.pendingProposals} />
                <OngoingDisputesSection disputes={dashboardData.ongoingDisputes} role={role} />
                <OngoingProposalsSection proposals={dashboardData.ongoingProposals} role={role} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <TransactionHistorySection transactions={transactions} />
                <TopReviewsSection reviews={reviews} />
            </div>
        </div>
    )
}