import { useCustomerProfileService } from "../CustomerProfileService"
import type { UserProfileUpdateDTO } from "../customerProfileInterfaces"

export const useUpdateUserProfile = () => {
    const { updateProfileData, isUpdating } = useCustomerProfileService()

    const handleUpdateData = async (body: UserProfileUpdateDTO) => await updateProfileData(body)

    return {
        isUpdating,
        handleUpdateData,
    }
}
