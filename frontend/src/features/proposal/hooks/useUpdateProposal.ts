import { useProposalServices } from "../proposalServices"
import type { UpdateProposalDTO } from "../proposalInterface"

export const useUpdateProposal = () => {
    const { isProposalUpdating, updateProposal } = useProposalServices()

    const handleUpdateProposal = async (payload: UpdateProposalDTO) => await updateProposal(payload)

    return {
        isProposalUpdating,
        handleUpdateProposal,

    }

}