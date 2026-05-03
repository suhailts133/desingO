import { useState } from "react"
import { useJobRequestServices } from "../jobService"
import { useNavigate } from "react-router-dom"

export const usePostJob = () => {
    const { postJob, isLoading } = useJobRequestServices()
    const [jobError, setJobError] = useState<string | null>(null)
    const [jobSuccess, setJobSuccess] = useState<string | null>(null)
    const navigate = useNavigate()
    const handleSubmission = async (payload: FormData) => {
        setJobError(null)
        setJobSuccess(null)
        const result = await postJob(payload);
        if (result.success) {
            setJobSuccess(result.message as string);
            setTimeout(() => {
                setJobSuccess(null)
                navigate("/customer/jobs")
            }, 3000);
        } else {
            setJobError(result.message as string)
            setTimeout(() => {
                setJobError(null)
            }, 3000);
        }
    }
    return {
        handleSubmission,
        isLoading,
        jobError,
        jobSuccess
    }
}