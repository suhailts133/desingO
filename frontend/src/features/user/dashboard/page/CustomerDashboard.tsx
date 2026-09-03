import { useDecodeAccessToken } from "../../../../helpers/decodeAccessToken"
import OngoingDisputesSection from "../../../../shared/dashboard/OngoingDisputesSection"
import OngoingProposalsSection from "../../../../shared/dashboard/OngoingProposalsSection"

import CustomerStatsOverview from "../component/CustomerStatsOverview"
import { useGetCustomerDashboardQuery } from "../customerDasboardEndpoints"

export default function CustomerDashboard() {
  const { data, error, isLoading } = useGetCustomerDashboardQuery()
  const dashboardData = data?.data
  const { role } = useDecodeAccessToken()
  if (isLoading) {
    return <div className="p-6 text-sm text-soft-black/50">Loading dashboard…</div>
  }

  if (error || !dashboardData) {
    return <div className="p-6 text-sm text-error">Couldn't load your dashboard. Please try again.</div>
  }

  return (
    <div className="w-full max-w-7xl flex flex-col gap-8">
      <CustomerStatsOverview data={dashboardData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <OngoingDisputesSection disputes={dashboardData.ongoingDisputes} role={role} />
        <OngoingProposalsSection proposals={dashboardData.ongoingProposals} role={role} />
      </div>
    </div>
  )
}