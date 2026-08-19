import { useProposalServices } from "../proposalServices"
import type { VersionAcceptOrRejectDTO } from "../proposalInterface"

export const useApproveOrRejectVersion = () => {
    const { isVersionApprovingOrRejecting, approveOrRejectVersionResult } = useProposalServices()


    const handleVersionApprovalOrRejection = async (body: VersionAcceptOrRejectDTO) => await approveOrRejectVersionResult(body)

    return {
        isVersionApprovingOrRejecting,
        handleVersionApprovalOrRejection,
    }

}