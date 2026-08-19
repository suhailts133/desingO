import { useProposalServices } from "../proposalServices"

export const useUploadResult = () => {
    const { isUploading, uploadResult } = useProposalServices()

    const handleServiceResultUpload = async (formData: FormData) => await uploadResult(formData)


    return {
        isUploading,
        handleServiceResultUpload,

    }

}