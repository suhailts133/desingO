import type { ToggleStatusPayload } from "./adminUserInterface"
import { useToggleStatusMutation } from "./adminUsersEndpoints"

export const useAdminUserServices = () => {
    const [toggleStatusMutation, { isLoading: isToggling }] = useToggleStatusMutation()

    const toggleStatus = async (payload: ToggleStatusPayload) => {
        try {
            const result = await toggleStatusMutation(payload).unwrap()
            return result
        } catch (error: any) {
            error.data
        }
    }

    return {
        isToggling,
        toggleStatus
    }
}