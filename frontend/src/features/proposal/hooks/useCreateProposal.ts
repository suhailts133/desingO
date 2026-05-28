import { useState } from "react"
import { useProposalServices } from "../proposalServices"
import type { CreateProposalDTO } from "../proposalInterface"

export const useCreateProposal = () => {
    const { isProposalCreating, createProposal } = useProposalServices()
    const [proposalError, setProposalError] = useState<string | null>(null)
    const [proposalSuccess, setProposalSuccess] = useState<string | null>(null)

    const handleSubmission = async (payload: CreateProposalDTO): Promise<boolean> => {
        setProposalError(null)
        setProposalSuccess(null)
        const result = await createProposal(payload)

        if (result.success) {
            setProposalSuccess(result.message as string)
            setTimeout(() => setProposalSuccess(null), 2000)
            return true       
        } else {
            setProposalError(result.message as string)
            setTimeout(() => setProposalError(""), 3000)
            return false      
        }
    }

    return {
        isProposalCreating,
        handleSubmission,
        proposalError,
        proposalSuccess
    }

}