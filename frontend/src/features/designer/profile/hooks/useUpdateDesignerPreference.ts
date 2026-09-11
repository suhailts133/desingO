import type { IDesignerPreference } from "../designerProfileInterface";
import { useDesignerProfileService } from "../designerProfileService";

export const useUpdatePreference = () => {
    const { updateDesignerPreference, isPreferenceUpdating } = useDesignerProfileService()

    const handleUpdatePreference = async (payload: IDesignerPreference) => await updateDesignerPreference(payload);
    return {
        handleUpdatePreference,
        isPreferenceUpdating,

    }
}