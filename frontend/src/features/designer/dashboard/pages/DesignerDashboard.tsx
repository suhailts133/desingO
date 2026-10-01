import {
  useGetDesignerDashboardQuery,
  useGetMyRecentTransactionQuery,
  useGetTopReviewsQuery,
} from "../dashboardEndpoints";
import { useRecommendJobsQuery } from "../../../common/commonEndpoints";
import JobCard from "../../../common/components/cards/JobCard";
import DesignerStatsOverview from "../component/DesignerStatsOverview";
import PendingProposalsSection from "../component/PendingProposalsSection";
import TopReviewsSection from "../component/TopReviewsSection";

import { useDecodeAccessToken } from "../../../../helpers/decodeAccessToken";
import OngoingProposalsSection from "../../../../shared/dashboard/OngoingProposalsSection";
import OngoingDisputesSection from "../../../../shared/dashboard/OngoingDisputesSection";
import TransactionHistorySection from "../../../../shared/dashboard/TransactionHistorySection";
import Spinner from "../../../../shared/common/Spinner";

export default function DesignerDashboard() {
  const { role } = useDecodeAccessToken();

  const { data, error, isLoading } = useGetDesignerDashboardQuery();
  const {
    data: transactionData,
    error: transactionError,
    isLoading: isTransactionLoading,
  } = useGetMyRecentTransactionQuery();
  const { data: reviewData, error: reviewError, isLoading: isReviewLoading } = useGetTopReviewsQuery();
  const { data: jobData, error: jobError, isLoading: isJobLoading } = useRecommendJobsQuery(undefined);

  const dashboardData = data?.data;
  const transactions = transactionData?.data;
  const reviews = reviewData?.data;
  const jobs = jobData?.data;

  if (isLoading || isTransactionLoading || isReviewLoading || isJobLoading) {
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

  if (reviewError || !reviews) {
    return <div className="p-6 text-sm text-error">Couldn't load your reviews. Please try again.</div>;
  }

  if (jobError || !jobs) {
    return <div className="p-6 text-sm text-error">Couldn't load job recommendations. Please try again.</div>;
  }

  const jobHeading = jobData?.type === "RECOMENDED" ? "These are your recommended jobs" : "These are recent jobs";

  return (
    <div className="w-full max-w-7xl flex flex-col gap-8 pb-12 lg:pb-16">
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

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-Jost-Semibold text-text-primary">{jobHeading}</h2>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jobs.map((job) => (
              <JobCard job={job} key={job.id} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-text-muted">No jobs found.</div>
        )}
      </div>
    </div>
  );
}
