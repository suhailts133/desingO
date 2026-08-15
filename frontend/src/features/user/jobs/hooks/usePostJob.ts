import { useJobRequestServices } from "../jobService"
export const usePostJob = () => {
    const { postJob, isLoading } = useJobRequestServices()
    const handleSubmission = async (payload: FormData) => await postJob(payload);
    return {
        handleSubmission,
        isLoading,

    }
}