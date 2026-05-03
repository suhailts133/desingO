import { useState } from "react"
import {  useMyJobApplicationServices} from "../myJobApplicationServices"

export const useDeleteMyJobApplication = () => {
    const { deleteMyJobApplication, isDeleting } = useMyJobApplicationServices()
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)
    const handleDeletion = async (id: string) => {
        setDeleteSuccess(null)
        setDeleteError(null)
        const result = await deleteMyJobApplication(id);
        if (result.success) {
            setDeleteSuccess(result.message as string);
            setTimeout(() => {
                setDeleteSuccess(null)

            }, 3000);
        } else {
            setDeleteError(result.message as string)
            setTimeout(() => {
                setDeleteError(null)
            }, 3000);
        }
    }
    return {
        handleDeletion,
        isDeleting,
        deleteError,
        deleteSuccess
    }
}