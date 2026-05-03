import { useState } from "react"
import { useJobRequestServices } from "../jobService"

export const useApplyForAJob = () => {
    const { applyForAJob, isApplying } = useJobRequestServices()
    const [applyError, setapplyError] = useState<string | null>(null)
    const [applySuccess, setApplySuccess] = useState<string | null>(null)


    const handleJobApplication = async (jobId: string): Promise<boolean> => {
        setApplySuccess(null)
        setapplyError(null)
        const result = await applyForAJob(jobId);
        if (result.success) {
            setApplySuccess(result.message as string);
            setTimeout(() => {
                setApplySuccess(null)

            }, 3000);
            return true
        } else {
            setapplyError(result.message as string)
            setTimeout(() => {
                setapplyError(null)
            }, 3000);
            return false
        }
    }
    return {
        handleJobApplication,
        isApplying,
        applyError,
        applySuccess
    }
}