import { isApiError, UNKNOWN_ERROR } from "../../helpers/errorhandler"
import { useAcceptOrRejectDisputeVerditMutation, useReportIssueMutation } from "./disputeEndpoints"
import type { AcceptOrRejectDisputeDTO } from "./proposalInterface"

export const useDisputeServices = () => {
    const [reportIssueMutation, { isLoading: isReporting }] = useReportIssueMutation()
    const [acceptOrRejectDisputeVerditMutation, { isLoading: isChecking }] = useAcceptOrRejectDisputeVerditMutation()
    const reporIssue = async (formData: FormData) => {
        try {

            const result = await reportIssueMutation(formData).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
    const acceptOrRejectDisputeVerdit = async (payload: AcceptOrRejectDisputeDTO) => {
        try {

            const result = await acceptOrRejectDisputeVerditMutation(payload).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }


    return {
        acceptOrRejectDisputeVerdit,
        isChecking,
        reporIssue,
        isReporting
    }
}