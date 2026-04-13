import { useState } from "react"
import type { JobApplicationApprovalOrRejectionPayload } from "../jobApplicationInterFace"
import { useJobApplicationServices } from "../jobApplicationServices"

export const useApproveOrRejectJobApplication = () => {
    const [approvalError, setApprovalError] = useState<string | null>(null)
    const [approvalSuccess, setApprovalSuccess] = useState<string | null>(null)
    // const [status, setStatus] = useState<string | null>(null)
    const { approveOrReject, isApproving } = useJobApplicationServices()

    const handleApproveOrReject = async (payload: JobApplicationApprovalOrRejectionPayload) => {
        setApprovalError(null)
        setApprovalSuccess(null)
        // setStatus(null)
        const result = await approveOrReject(payload)
        if (result?.success) {
            // setStatus(result.data?.status as Status)
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
        isApproving,
        approvalError,
        approvalSuccess,
        // status
    }
} 