import { useState } from "react"
import type { IApiResponse } from "../../../../api/responseType"
import { useCustomerProfileService } from "../CustomerProfileService"
import type { UserProfileUpdateDTO } from "../customerProfileInterfaces"

export const useUpdateUserProfile = () => {
    const { updateProfileData, isUpdating } = useCustomerProfileService()
    const [dataError, setDataError] = useState<string | null>(null)
    const [dataSuccess, setDataSuccess] = useState<string | null>(null)
    const [newData, setNewData] = useState<UserProfileUpdateDTO | null>(null)
    const handleUpdateData = async (body: UserProfileUpdateDTO) => {
        setDataError(null)
        setDataSuccess(null)
        setNewData(null)
        const result: IApiResponse<UserProfileUpdateDTO> = await updateProfileData(body);
        if (result.success) {
            setDataSuccess(result.message as string);
            setNewData(result.data as UserProfileUpdateDTO)
        } else {
            setDataError(result.message as string)
            setTimeout(() => {
                setDataError(null)
            }, 3000);
        }
    }
    return {
        handleUpdateData,
        isUpdating,
        dataSuccess,
        dataError,
        newData,
        resetStateProfileUpdation: () => {
            setDataSuccess(null)
            setDataError(null)
        }
    }
}