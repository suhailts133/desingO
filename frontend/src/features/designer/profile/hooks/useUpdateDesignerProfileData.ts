import { useDesignerProfileService } from "../designerProfileService"
import type { DesignerUpdateResponseDTO } from "../designerProfileInterface"

export const useUpdateDesignerProfileData = () => {
    const { updateProfileData, isUpdating } = useDesignerProfileService()
    const handleUpdateData = async (body: DesignerUpdateResponseDTO) => await updateProfileData(body);

    return {
        handleUpdateData,
        isUpdating,
    }
}
