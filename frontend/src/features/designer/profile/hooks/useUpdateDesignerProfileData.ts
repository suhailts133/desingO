import { useState } from "react"
import type { IApiResponse } from "../../../../api/responseType"
import { useDesignerProfileService } from "../designerProfileService"
import type { DesignerUpdateResponseDTO } from "../designerProfileInterface"

export const useUpdateDesignerProfileData = () => {
    const { updateProfileData, isUpdating } = useDesignerProfileService()
    const [dataError, setDataError] = useState<string | null>(null)
    const [dataSuccess, setDataSuccess] = useState<string | null>(null)
    const [newData, setNewData] = useState<DesignerUpdateResponseDTO | null>(null)
    const handleUpdateData = async (body: DesignerUpdateResponseDTO) => {
        setDataError(null)
        setDataSuccess(null)
        setNewData(null)
        const result: IApiResponse<DesignerUpdateResponseDTO> = await updateProfileData(body);
        if (result.success) {
            setDataSuccess(result.message as string);
            setNewData(result.data as DesignerUpdateResponseDTO)
        } else {
            setDataError(result.message as string)
            setTimeout(() => {
                setDataError(null)
            }, 3000);
        }
    }
    return {
        handleUpdateData,
        isUpdating,
        dataSuccess,
        dataError,
        newData,
        resetStateProfileUpdation: () => {
            setDataSuccess(null)
            setDataError(null)
        }
    }
}