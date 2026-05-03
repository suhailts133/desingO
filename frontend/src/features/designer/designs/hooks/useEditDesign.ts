import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDesignServices } from "../designService"

export const useEditDesign = () => {
    const { editDesign, isEditing } = useDesignServices()
    const [updateError, setUpdateError] = useState<string | null>(null)
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleUpdation = async ({ formdata, id }: { formdata: FormData; id: string }): Promise<boolean> => {
        setUpdateSuccess(null)
        setUpdateError(null)

        const result = await editDesign({ formdata, id });
        if (result.success) {
            setUpdateSuccess(result.message as string);
            setTimeout(() => {
                setUpdateSuccess(null)
                navigate("/designer/designs")
            }, 2000);
            return true
        } else {
            setUpdateError(result.message as string)
            setTimeout(() => {
                setUpdateError(null)
            }, 3000);
            return false
        }
    }
    return {
        handleUpdation,
        isEditing,
        updateError,
        updateSuccess
    }
}