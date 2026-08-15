
import { useJobRequestServices } from "../jobService"



export const useEditJobRequest = () => {
    const { editJob, isEditing } = useJobRequestServices()

    const handleUpdation = async ({ formdata, id }: { formdata: FormData; id: string }) => await editJob({ formdata, id });
    return {
        handleUpdation,
        isEditing,
    }
}