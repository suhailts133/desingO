import { useJobRequestServices } from "../jobService"

export const useDeleteAJob = () => {
    const { deleteAJob, isDeleting } = useJobRequestServices()

    const handleDeletion = async (id: string) => await deleteAJob(id);
    return {
        handleDeletion,
        isDeleting,
        
    }
}