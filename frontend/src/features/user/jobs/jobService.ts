import { isApiError, UNKNOWN_ERROR } from "../../../helpers/errorhandler";
import { useApplyForAJobMutation, useDeleteAJobMutation, usePostJobMutation, useEditJobMutation } from "./jobEndpoints";

export const useJobRequestServices = () => {
    const [postJobMutation, { isLoading }] = usePostJobMutation();
    const [deleteAJobMutation, { isLoading: isDeleting }] = useDeleteAJobMutation()
    const [applyForAJobMutation, { isLoading: isApplying }] = useApplyForAJobMutation()
    const [editJobMutation, { isLoading: isEditing }] = useEditJobMutation()

    const editJob = async ({ formdata, id }: { formdata: FormData; id: string }) => {
        try {
            const result = await editJobMutation({ formdata, id }).unwrap();
            return result;
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    };
    const postJob = async (payload: FormData) => {
        try {
            const result = await postJobMutation(payload).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
    const deleteAJob = async (id: string) => {
        try {
            const result = await deleteAJobMutation(id).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
    const applyForAJob = async (jobId: string) => {
        try {
            const result = await applyForAJobMutation(jobId).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }



    return {
        postJob,
        isLoading,
        deleteAJob,
        isDeleting,
        applyForAJob,
        isApplying,
        editJob,
        isEditing
    }
}