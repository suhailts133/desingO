import {  useMyJobApplicationServices} from "../myJobApplicationServices"

export const useDeleteMyJobApplication = () => {
    const { deleteMyJobApplication, isDeleting } = useMyJobApplicationServices()
    const handleDeletion = async (id: string) => await deleteMyJobApplication(id);
    
    return {
        handleDeletion,
        isDeleting,
    }
}