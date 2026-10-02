import type { JobApplicationApprovalOrRejectionPayload } from "../jobApplicationInterFace";
import { useJobApplicationServices } from "../jobApplicationServices";
export const useApproveOrRejectJobApplication = () => {
  const { approveOrReject, isApproving } = useJobApplicationServices();

  const handleApproveOrReject = async (payload: JobApplicationApprovalOrRejectionPayload) =>
    await approveOrReject(payload);

  return {
    handleApproveOrReject,
    isApproving,
  };
};
