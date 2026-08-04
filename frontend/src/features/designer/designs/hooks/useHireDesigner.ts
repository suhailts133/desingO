import { useState } from "react"
import { useDesignServices } from "../designService"
import type {  HireDesignerFields } from "../../../user/jobs/jobInterface"


export const useHireDesigner = () => {
    const { hireDesigner, isHiring } = useDesignServices()
    const [hireError, setHireError] = useState<string | null>(null)
    const [hireSuccess, setHireSuccess] = useState<string | null>(null)

    const handleSubmission = async (body: HireDesignerFields) => {
        setHireError(null)
        setHireSuccess(null)
        const result = await hireDesigner(body)

        if (result.success) {
            setHireSuccess(result.message as string)
            setTimeout(() => setHireSuccess(null), 2000)
        } else {
            setHireError(result.message as string)
            setTimeout(() => setHireError(""), 3000)
        }

        return result 
    }

    return {
        handleSubmission,
        isHiring,
        hireError,
        hireSuccess
    }
}