import { useState } from "react"
import { useJobRequestServices } from "../jobService"

import type { IApiResponse } from "../../../../api/responseType"

export const useDeleteAJob = () => {
    const {deleteAJob, isDeleting} = useJobRequestServices()
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)
    const handleDeletion  = async (id:string) => {
        setDeleteSuccess(null)
        setDeleteError(null)
        const result:IApiResponse = await deleteAJob(id);
        if(result.success){
            setDeleteSuccess(result.message as string);
            setTimeout(() => {
                setDeleteSuccess(null)
               
            }, 3000);
        }else{
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