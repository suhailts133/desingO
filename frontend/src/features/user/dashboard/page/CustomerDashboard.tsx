import { useDecodeAccessToken } from "../../../../helpers/decodeAccessToken";
import Spinner from "../../../../shared/common/Spinner";
import OngoingDisputesSection from "../../../../shared/dashboard/OngoingDisputesSection";
import OngoingProposalsSection from "../../../../shared/dashboard/OngoingProposalsSection";
import TransactionHistorySection from "../../../../shared/dashboard/TransactionHistorySection";
import { useRecommendDesignsQuery } from "../../../common/commonEndpoints";
import DesignCard from "../../../common/components/cards/DesignCard";
import { useGetMyRecentTransactionQuery } from "../../../designer/dashboard/dashboardEndpoints";
import type { GetAllDesignCommonResponseDTO } from "../../../designer/designs/designInterface";

import CustomerStatsOverview from "../component/CustomerStatsOverview";
import { useGetCustomerDashboardQuery } from "../customerDasboardEndpoints";

export default function CustomerDashboard() {
  const { data, error, isLoading } = useGetCustomerDashboardQuery();
  const {
    data: transactionData,
    error: transactionError,
    isLoading: isTransactionLoading,
  } = useGetMyRecentTransactionQuery();
  const { data: designData, error: designError, isLoading: isDesignLoading } = useRecommendDesignsQuery();

  const dashboardData = data?.data;
  const transactions = transactionData?.data;
  const designs = designData?.data;
  const { role } = useDecodeAccessToken();

  if (isLoading || isTransactionLoading || isDesignLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !dashboardData) {
    return <div className="p-6 text-sm text-error">Couldn't load your dashboard. Please try again.</div>;
  }
  if (transactionError || !transactions) {
    return <div className="p-6 text-sm text-error">Couldn't load your transactions. Please try again.</div>;
  }
  if (designError || !designs) {
    return <div className="p-6 text-sm text-error">Couldn't load recommended designs. Please try again.</div>;
  }

  const recommendType = designData?.type;
  const designSectionTitle =
    recommendType === "RECOMENDED" ? "These are your recommended designs" : "These are the recent designs";

  return (
    <div className="w-full max-w-7xl flex flex-col gap-8 pb-12 lg:pb-16">
      <CustomerStatsOverview data={dashboardData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <OngoingDisputesSection disputes={dashboardData.ongoingDisputes} role={role} />
        <OngoingProposalsSection proposals={dashboardData.ongoingProposals} role={role} />
      </div>

      <TransactionHistorySection transactions={transactions} />

      <div className="flex flex-col gap-4">
        {designSectionTitle && <h2 className="text-xl font-Jost-Semibold text-text-primary">{designSectionTitle}</h2>}

        {designs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {designs.map((item: GetAllDesignCommonResponseDTO) => (
              <DesignCard design={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-text-muted">No designs found.</div>
        )}
      </div>
    </div>
  );
}
