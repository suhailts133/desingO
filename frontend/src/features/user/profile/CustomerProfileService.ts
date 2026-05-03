import { isApiError, UNKNOWN_ERROR } from "../../../helpers/errorhandler"
import { useUpdateUserProfileDataMutation } from "./customerProfileEndpoints"
import type { UserProfileUpdateDTO } from "./customerProfileInterfaces"

export const useCustomerProfileService = () => {

    const [updateUserProfileDataMutation, { isLoading: isUpdating }] = useUpdateUserProfileDataMutation()

    const updateProfileData = async (body: UserProfileUpdateDTO) => {
        try {
            const result = await updateUserProfileDataMutation(body).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    return {
        isUpdating,
        updateProfileData
    }
}