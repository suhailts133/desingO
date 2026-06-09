import { useState } from "react"

import { useDesignServices } from "../designService"

export const useEditDesign = () => {
    const { editDesign, isEditing } = useDesignServices()
    const [updateError, setUpdateError] = useState<string | null>(null)
  
    const handleUpdation = async ({ formdata, id }: { formdata: FormData; id: string }): Promise<boolean> => {
      
        setUpdateError(null)

        const result = await editDesign({ formdata, id });
        if (result.success) {
            return true
        } else {
            setUpdateError(result.message as string)
            return false
        }
    }
    return {
        handleUpdation,
        isEditing,
        updateError
    }
}