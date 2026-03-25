import { useState } from "react"
import { useAdminDesignerVerificationService } from "../adminDesignerVerificationService"
import type { AdminDesignerApprovalPayload, Status } from "../adminDesignerVerificationInterfaces"

export const useApproveOrRejectDesigner = () => {
    const [approvalError, setApprovalError] = useState<string | null>(null)
    const [approvalSuccess, setApprovalSuccess] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)
    const { approveOrRejectDesigner, isLoading } = useAdminDesignerVerificationService()

    const handleApproveOrReject = async (payload: AdminDesignerApprovalPayload) => {
        setApprovalError(null)
        setApprovalSuccess(null)
        setStatus(null)
        const result = await approveOrRejectDesigner(payload)
        if (result?.success) {
            setStatus(result.data?.status as Status)
            setApprovalSuccess(result.message as string);
            setTimeout(() => {
                setApprovalSuccess(null)
            }, 3000);
            return true
        } else {
            setApprovalError(result?.message as string)
            setTimeout(() => {
                setApprovalError(null)
            }, 3000);
        }
        return false
    }
    return {
        handleApproveOrReject,
        isApprovalLoading: isLoading,
        approvalError,
        approvalSuccess,
        status
    }
} 