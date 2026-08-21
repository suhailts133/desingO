
import { useProposalServices } from "../proposalServices"
import type { CreateProposalDTO } from "../proposalInterface"

export const useCreateProposal = () => {
    const { isProposalCreating, createProposal } = useProposalServices()

    const handleSubmission = async (payload: CreateProposalDTO) => await createProposal(payload)

    return {
        isProposalCreating,
        handleSubmission,

    }

}