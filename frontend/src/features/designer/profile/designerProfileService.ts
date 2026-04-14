import { useUpdateProfileImageMutation, useUpdateProfileDataMutation } from "./designerProfileEndpoints"
import type {  DesignerUpdateResponseDTO } from "./designerProfileInterface"

export const useDesignerProfileService = () => {
    const [updateProfileImageMutation, { isLoading: isChanging }] = useUpdateProfileImageMutation()
    const [updateProfileDataMutation, { isLoading: isUpdating }] = useUpdateProfileDataMutation()
    

    const updateProfileImage = async (formData: FormData) => {
        try {
            const result = await updateProfileImageMutation(formData).unwrap()
            return result
        } catch (error: any) {
            return error.data
        }
    }

    const updateProfileData = async (body: DesignerUpdateResponseDTO) => {
        try {
            const result = await updateProfileDataMutation(body).unwrap()
            return result
        } catch (error: any) {
            return error.data
        }
    }

    return {
        isChanging,
        updateProfileImage,
        isUpdating,
        updateProfileData
    }
}