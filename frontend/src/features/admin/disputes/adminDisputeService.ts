import { isApiError, UNKNOWN_ERROR } from "../../../helpers/errorhandler"
import { useGiveVerditMutation } from "./adminDispueEndpoint"
import type { DisputeSolutionDTO } from "./adminDisputeInterface"

export const useAdminDisputeService = () => {
    const [giveVerditMutation, { isLoading: isSubmitting }] = useGiveVerditMutation()
    const giveVerdit = async (payload: DisputeSolutionDTO) => {
        try {

            const result = await giveVerditMutation(payload).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    return {
        isSubmitting,
        giveVerdit,
    }
}