import { isApiError, UNKNOWN_ERROR } from "../../../helpers/errorhandler"
import type { ToggleStatusPayload } from "./adminUserInterface"
import { useToggleStatusMutation } from "./adminUsersEndpoints"

export const useAdminUserServices = () => {
    const [toggleStatusMutation, { isLoading: isToggling }] = useToggleStatusMutation()

    const toggleStatus = async (payload: ToggleStatusPayload) => {
        try {
            const result = await toggleStatusMutation(payload).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    return {
        isToggling,
        toggleStatus
    }
}