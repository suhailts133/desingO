import { useState } from "react"
import { useJobRequestServices } from "../jobService"


import { useNavigate } from "react-router-dom"

export const useEditJobRequest = () => {
    const { editJob, isEditing } = useJobRequestServices()
    const [updateError, setUpdateError] = useState<string | null>(null)
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleUpdation = async ({ formdata, id }: { formdata: FormData; id: string }): Promise<boolean> => {
        setUpdateSuccess(null)
        setUpdateError(null)

        const result = await editJob({ formdata, id });
        if (result.success) {
            setUpdateSuccess(result.message as string);
            setTimeout(() => {
                setUpdateSuccess(null)
                navigate("/customer/jobs")
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