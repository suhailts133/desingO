import { useState } from "react"
import type { ISavedDesignDTO } from "../commonInterface"
import { useCommonServices } from "../commonServices"

export const useToggleSaveDesign = () => {
    const [error, setError] = useState<string | null>(null)
    const { saveDesign, isLoading } = useCommonServices()

    const handleToggling = async (payload: ISavedDesignDTO) => {
        setError(null)

        const result = await saveDesign(payload);
        if (result.success) {
            return result?.data as boolean
        } else {
            setError(result.message as string)
        }
    }
    return {
        handleToggling,
        savedError:error,
        isToggling:isLoading
    }


}