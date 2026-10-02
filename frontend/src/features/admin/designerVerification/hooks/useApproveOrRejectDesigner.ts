import { useAdminDesignerVerificationService } from "../adminDesignerVerificationService";
import type { AdminDesignerApprovalPayload } from "../adminDesignerVerificationInterfaces";

export const useApproveOrRejectDesigner = () => {
  const { approveOrRejectDesigner, isLoading } = useAdminDesignerVerificationService();

  const handleApproveOrReject = async (payload: AdminDesignerApprovalPayload) => await approveOrRejectDesigner(payload);

  return {
    handleApproveOrReject,
    isApprovalLoading: isLoading,
  };
};
