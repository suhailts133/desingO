import { useState } from "react"
import { useProposalServices } from "../proposalServices"

export const useUploadResult = () => {
    const { isUploading, uploadResult } = useProposalServices()
    const [uploadError, setUploadError] = useState<string | null>(null)

    const handleServiceResultUpload = async (formData: FormData): Promise<boolean> => {
        setUploadError(null)
        const result = await uploadResult(formData)

        if (result.success) {

            return true
        } else {
            setUploadError(result.message as string)
            setTimeout(() => setUploadError(""), 3000)
            return false
        }
    }

    return {
        isUploading,
        handleServiceResultUpload,
        uploadError
    }

}