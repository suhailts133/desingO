import type { IApiResponse } from "../../../api/responseType"
import { isApiError, UNKNOWN_ERROR } from "../../../helpers/errorhandler"
import { useUpdateProfileImageMutation, useUpdateProfileDataMutation, useUpdateDesignerPreferenceMutation } from "./designerProfileEndpoints"
import type { DesignerUpdateResponseDTO, IDesignerPreference } from "./designerProfileInterface"

export const useDesignerProfileService = () => {
    const [updateProfileImageMutation, { isLoading: isChanging }] = useUpdateProfileImageMutation()
    const [updateProfileDataMutation, { isLoading: isUpdating }] = useUpdateProfileDataMutation()
    const [updateDesignerPreferenceMutation, { isLoading: isPreferenceUpdating }] = useUpdateDesignerPreferenceMutation()

    const updateDesignerPreference = async (formData: IDesignerPreference) => {
        try {
            const result = await updateDesignerPreferenceMutation(formData).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
    const updateProfileImage = async (formData: FormData) => {
        try {
            const result = await updateProfileImageMutation(formData).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    const updateProfileData = async (body: DesignerUpdateResponseDTO): Promise<IApiResponse<DesignerUpdateResponseDTO | null>> => {
        try {
            const result = await updateProfileDataMutation(body).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    return {
        isChanging,
        updateProfileImage,
        isUpdating,
        updateProfileData,
        updateDesignerPreference,
        isPreferenceUpdating
    }
}