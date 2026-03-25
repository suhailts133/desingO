import { useDeleteAJobMutation, usePostJobMutation } from "./jobEndpoints";
import type { IJobRequestPayload } from "./jobInterface";

export const useJobRequestServices = () => {
    const [postJobMutation, { isLoading }] = usePostJobMutation();
    const [deleteAJobMutation, { isLoading: isDeleting }] = useDeleteAJobMutation()

    const postJob = async (payload: IJobRequestPayload) => {
        try {
            const result = await postJobMutation(payload).unwrap()
            return result
        } catch (error: any) {
            return error.data
        }
    }
    const deleteAJob = async (id: string) => {
        try {
            const result = await deleteAJobMutation(id).unwrap()
            return result
        } catch (error: any) {
            return error.data
        }
    }



    return {
        postJob,
        isLoading,
        deleteAJob,
        isDeleting
    }
}