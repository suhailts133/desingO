
import {  useDesignerProfileService} from "../designerProfileService"

export const useChangeProfileImage = () => {
    const { updateProfileImage, isChanging } = useDesignerProfileService()
    const handleUpdateImage = async (formData:FormData) =>  await updateProfileImage(formData);

    return {
        handleUpdateImage,
        isChanging,
    }
}
