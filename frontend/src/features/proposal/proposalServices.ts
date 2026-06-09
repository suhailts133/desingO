import { isApiError, UNKNOWN_ERROR } from "../../helpers/errorhandler"
import { useCreateIntentMutation } from "./paymentEndpoints"
import { useApproveRejectMutation, useCreateProposalMutation } from "./proposalEndpoints"
import type { CreateProposalDTO, ProposalAcceptOrRejectDTO, ReviewPayload } from "./proposalInterface"
import { useAddYourReviewMutation } from "./wishlistEndpoints"

export const useProposalServices = () => {
    const [createProposalMutation, { isLoading: isProposalCreating }] = useCreateProposalMutation()
    const [approveRejectMutation, { isLoading: isChangingStatus }] = useApproveRejectMutation()
    const [addyourReivewMutation, { isLoading: isReviewing }] = useAddYourReviewMutation()
    const [createIntentMutaiton, { isLoading: ispaymentDataLoading }] = useCreateIntentMutation()

    const createIntent = async (jobId: string) => {
        try {
          
            const result = await createIntentMutaiton(jobId).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
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

    const writeReview = async (payload: ReviewPayload) => {
        try {
            const result = await addyourReivewMutation(payload).unwrap()
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
        isChangingStatus,
        writeReview,
        isReviewing,
        createIntent,
        ispaymentDataLoading
    }
}