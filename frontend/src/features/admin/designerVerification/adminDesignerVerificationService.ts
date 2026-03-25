import { useApproveOrRejectDesignerMutation } from "./adminDesignerVerificationEndpoints"
import type { AdminDesignerApprovalPayload } from "./adminDesignerVerificationInterfaces"

export const useAdminDesignerVerificationService = () => {
    const [approveOrRejectDesignerMutation, { isLoading }] = useApproveOrRejectDesignerMutation()
    const approveOrRejectDesigner = async (payload: AdminDesignerApprovalPayload) => {
        try {
            const result = await approveOrRejectDesignerMutation(payload).unwrap()
            return result
        } catch (error: any) {
            error.data
        }
    }

    return {
        isLoading,
        approveOrRejectDesigner
    }
}