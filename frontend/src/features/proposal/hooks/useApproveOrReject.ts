import { useProposalServices } from "../proposalServices"
import type { ProposalAcceptOrRejectDTO } from "../proposalInterface"

export const useApproveOrReject = () => {
    const { isChangingStatus, approveOrReject } = useProposalServices()
    

    const handleUpdateStatus = async (payload: ProposalAcceptOrRejectDTO) => await approveOrReject(payload)

    return {
        isChangingStatus,
        handleUpdateStatus,
    }

}