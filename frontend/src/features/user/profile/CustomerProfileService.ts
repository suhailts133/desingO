import { useUpdateUserProfileDataMutation } from "./customerProfileEndpoints"
import type { UserProfileUpdateDTO } from "./customerProfileInterfaces"

export const useCustomerProfileService = () => {

    const [updateUserProfileDataMutation, { isLoading: isUpdating }] = useUpdateUserProfileDataMutation()

    const updateProfileData = async (body: UserProfileUpdateDTO) => {
        try {
            const result = await updateUserProfileDataMutation(body).unwrap()
            return result
        } catch (error: any) {
            return error.data
        }
    }

    return {
        isUpdating,
        updateProfileData
    }
}