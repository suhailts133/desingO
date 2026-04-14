import { useState } from "react"
import type { IApiResponse } from "../../../../api/responseType"
import {  useDesignerProfileService} from "../designerProfileService"

export const useChangeProfileImage = () => {
    const { updateProfileImage, isChanging } = useDesignerProfileService()
    const [updateError, setUpdateError] = useState<string | null>(null)
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)
    const [newImage, setNewImage]  = useState<string | null>(null)
    const handleUpdateImage = async (formData:FormData) => {
        setUpdateError(null)
        setUpdateSuccess(null)
        setNewImage(null)
        const result: IApiResponse<string> = await updateProfileImage(formData);
        if (result.success) {
            setUpdateSuccess(result.message as string);
            setNewImage(result.data as string)
        } else {
            setUpdateError(result.message as string)
            setTimeout(() => {
                setUpdateError(null)
            }, 3000);
        }
    }
    return {
        handleUpdateImage,
        isChanging,
        updateError,
        updateSuccess,
        newImage,
        resetState:()=> {
            setUpdateError(null)
            setUpdateSuccess(null)
        }
    }
}