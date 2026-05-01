import { useState } from "react"
import DesignerInfo from "../components/DesignerInfo"
import ProfileImage from "../../../../shared/common/ProfileImage"
import { useGetDesignerProfileQuery } from "../designerProfileEndpoints"
import ProfileImageUploadForm from "../../../../shared/profile/ProfileImageUploadForm"
import DesignerUpdationForm from "../components/DesignerUpdateForm"
import { useChangeProfileImage } from "../hooks/useChangeProfileImage"
import { useUpdateDesignerProfileData } from "../hooks/useUpdateDesignerProfileData"
import type {  DesignerUpdateResponseDTO } from "../designerProfileInterface"

export default function DesignerProfilePage() {
    const [changeImage, setChangeImage] = useState<boolean>(false)
    const [updateProfile, setUpdateProfile] = useState<boolean>(false)
    const { handleUpdateImage, isChanging, updateError, updateSuccess, newImage, resetState } = useChangeProfileImage()
    const { handleUpdateData, isUpdating, dataError, dataSuccess, newData, resetStateProfileUpdation } = useUpdateDesignerProfileData()
    const { data, error, isLoading } = useGetDesignerProfileQuery()
    const profile = data?.data

    if (isLoading) return <p>Loading...</p>
    if (error || !profile) return <p>Error while loading profile</p>

    const handleImageChange = async (data: FormData) => {
        await handleUpdateImage(data)
    }

    const handleProfileDataUpdation = async (data: DesignerUpdateResponseDTO) => {
        await handleUpdateData(data)
    }

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