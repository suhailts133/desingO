import { useState } from "react"
import { useProposalServices } from "../proposalServices"
import type { ProposalAcceptOrRejectDTO } from "../proposalInterface"

export const useApproveOrReject = () => {
    const { isChangingStatus, approveOrReject } = useProposalServices()
    const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null)
    const [statusUpdateSuccess, setStatusUpdateSuccess] = useState<string | null>(null)
    const [newStatus, setNewStatus] = useState<"Accepted" | "Rejected" | null>(null)

    const handleUpdateStatus = async (payload: ProposalAcceptOrRejectDTO) => {
        setStatusUpdateError(null)
        setStatusUpdateSuccess(null)
        const result = await approveOrReject(payload)

        if (result.success) {
            setStatusUpdateSuccess(result.message as string)
            setNewStatus(result.data!)
            setTimeout(() => setStatusUpdateSuccess(null), 2000)

        } else {
            setStatusUpdateError(result.message as string)
            setTimeout(() => setStatusUpdateError(""), 3000)

        }
    }

    return {
        isChangingStatus,
        handleUpdateStatus,
        statusUpdateSuccess,
        newStatus,
        statusUpdateError
    }

}