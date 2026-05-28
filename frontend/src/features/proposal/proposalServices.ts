import { isApiError, UNKNOWN_ERROR } from "../../helpers/errorhandler"
import { useApproveRejectMutation, useCreateProposalMutation } from "./proposalEndpoints"
import type { CreateProposalDTO, ProposalAcceptOrRejectDTO } from "./proposalInterface"

export const useProposalServices = () => {
    const [createProposalMutation, { isLoading: isProposalCreating }] = useCreateProposalMutation()
    const [approveRejectMutation, { isLoading: isChangingStatus }] = useApproveRejectMutation()

    const createProposal = async (payload: CreateProposalDTO) => {
        try {
            const result = await createProposalMutation(payload).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
    const approveOrReject = async (payload: ProposalAcceptOrRejectDTO) => {
        try {
            const result = await approveRejectMutation(payload).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    return {
        createProposal,
        isProposalCreating,
        approveOrReject,
        isChangingStatus
    }
}