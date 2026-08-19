import { isApiError, UNKNOWN_ERROR } from "../../helpers/errorhandler"
import { useCreateIntentMutation, useGetPaymentIdMutation } from "./paymentEndpoints"
import { useApproveOrRejectVersionResultMutation, useApproveRejectMutation, useCreateProposalMutation, useUploadResultMutation } from "./proposalEndpoints"
import type { CreateProposalDTO, ProposalAcceptOrRejectDTO, ReviewPayload, VersionAcceptOrRejectDTO } from "./proposalInterface"
import { useAddYourReviewMutation } from "./wishlistEndpoints"

export const useProposalServices = () => {
    const [createProposalMutation, { isLoading: isProposalCreating }] = useCreateProposalMutation()
    const [approveRejectMutation, { isLoading: isChangingStatus }] = useApproveRejectMutation()
    const [addyourReivewMutation, { isLoading: isReviewing }] = useAddYourReviewMutation()
    const [createIntentMutaiton, { isLoading: ispaymentDataLoading }] = useCreateIntentMutation()
    const [uploadResultMutation, { isLoading: isUploading }] = useUploadResultMutation()
    const [getPaymentIdMUtation, { isLoading: isVerifying }] = useGetPaymentIdMutation()
    const [approveOrRejectVersionResultMutation, { isLoading: isVersionApprovingOrRejecting }] = useApproveOrRejectVersionResultMutation()

    const approveOrRejectVersionResult = async (body: VersionAcceptOrRejectDTO) => {
        try {

            const result = await approveOrRejectVersionResultMutation(body).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
    const uploadResult = async (formData: FormData) => {
        try {

            const result = await uploadResultMutation(formData).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
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
    const getPaymentId = async (intentId: string) => {
        try {
            const result = await getPaymentIdMUtation(intentId).unwrap()
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
        ispaymentDataLoading,
        uploadResult,
        isUploading,
        getPaymentId,
        isVerifying,
        approveOrRejectVersionResult,
        isVersionApprovingOrRejecting
    }
}