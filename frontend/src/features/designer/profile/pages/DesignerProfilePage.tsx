import { useState } from "react"
import DesignerInfo from "../components/DesignerInfo"
import ProfileImage from "../../../../shared/common/ProfileImage"
import { useGetDesignerProfileQuery } from "../designerProfileEndpoints"
import ProfileImageUploadForm from "../../../../shared/profile/ProfileImageUploadForm"
import DesignerUpdationForm from "../components/DesignerUpdateForm"
import { useChangeProfileImage } from "../hooks/useChangeProfileImage"
import { useUpdateDesignerProfileData } from "../hooks/useUpdateDesignerProfileData"
import type { DesignerUpdateResponseDTO, IDesignerPreference, IDesignerPreferencePayload } from "../designerProfileInterface"
import DesignerPreferences from "../components/DesignerPreferences"
import DesignerPreferenceForm from "../components/DesignerPreferenceForm"
import { useUpdatePreference } from "../hooks/useUpdateDesignerPreference"
import { fromOptions } from "../../../../helpers/optionHelper"
import { useHandleResponse } from "../../../../helpers/useHandleResponse"

export default function DesignerProfilePage() {
    const [changeImage, setChangeImage] = useState<boolean>(false)
    const [updateProfile, setUpdateProfile] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState(false);
    const [newPreference, setNewPreference] = useState<IDesignerPreference | undefined>(undefined)
    const { handleUpdateImage, isChanging, updateError, updateSuccess, newImage, resetState } = useChangeProfileImage()
    const { handleUpdateData, isUpdating, dataError, dataSuccess, newData, resetStateProfileUpdation } = useUpdateDesignerProfileData()
    const { handleUpdatePreference, isPreferenceUpdating } = useUpdatePreference()
    const { data, error, isLoading } = useGetDesignerProfileQuery()
    const profile = data?.data
    const responseHelper = useHandleResponse()
    if (isLoading) return <p>Loading...</p>
    if (error || !profile) return <p>Error while loading profile</p>

    const handleImageChange = async (data: FormData) => {
        await handleUpdateImage(data)
    }

    const handleProfileDataUpdation = async (data: DesignerUpdateResponseDTO) => {
        await handleUpdateData(data)
    }
    const handleDesignerPreference = async (payload: IDesignerPreferencePayload) => {
        const data: IDesignerPreference = {
            designStyle: fromOptions(payload.designStyle),
            propertyType: fromOptions(payload.propertyType),
        };

        const result = await handleUpdatePreference(data);
        setNewPreference(result.data ?? undefined)
        setIsEditing(false);
        responseHelper(result.success, "Updated the preference", result.message)
    };

    return (
        <div className="flex flex-col items-center w-full max-w-xl gap-8 py-10">
            <ProfileImage
                newProfileImage={newImage ?? undefined}
                isGoogle={profile.isGoogle}
                profileImage={profile.profileImage}
                profile_image_url={profile.profile_image_url}
                onChangeImage={() => setChangeImage(true)}
            />
            <DesignerInfo
                newData={newData ?? undefined}
                profile={profile}
                onUpdate={() => setUpdateProfile(true)}
            />

            <DesignerPreferences preferences={newPreference ?? profile.prefernces} onOpen={() => setIsEditing(true)} />
            <DesignerPreferenceForm
                isOpen={isEditing}
                isLoading={isPreferenceUpdating}
                data={profile.prefernces}
                onClose={() => setIsEditing(false)}
                updatePreferences={handleDesignerPreference}
            />
            <ProfileImageUploadForm
                isLoading={isChanging}
                errorMessage={updateError ?? undefined}
                successMessage={updateSuccess ?? undefined}
                isOpen={changeImage}
                onClose={() => {
                    setChangeImage(false)
                    resetState()
                }}
                updateImage={handleImageChange}
            />

            <DesignerUpdationForm
                isLoading={isUpdating}
                dataError={dataError ?? undefined}
                dataSuccess={dataSuccess ?? undefined}
                updateProfileData={handleProfileDataUpdation}
                data={profile}
                isOpen={updateProfile}
                onClose={() => {
                    setUpdateProfile(false)
                    resetStateProfileUpdation()
                }}
            />
        </div>
    )
}