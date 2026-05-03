import { useState } from "react"
import CustomerInfo from "../components/CustomerInfo"
import ProfileImage from "../../../../shared/common/ProfileImage"
import { useGetUserProfileQuery } from "../customerProfileEndpoints"
import ProfileImageUploadForm from "../../../../shared/profile/ProfileImageUploadForm"
import CustomerUpdateForm from "../components/CustomerUpdateForm"
import { useChangeProfileImage } from "../../../designer/profile/hooks/useChangeProfileImage"
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile"
import type { UserProfileUpdateDTO } from "../customerProfileInterfaces"

export default function CustomerProfilePage() {
    const [changeImage, setChangeImage] = useState<boolean>(false)
    const [updateProfile, setUpdateProfile] = useState<boolean>(false)
    const { handleUpdateImage, isChanging, updateError, updateSuccess, newImage, resetState } = useChangeProfileImage()
    const { handleUpdateData, isUpdating, dataError, dataSuccess, newData, resetStateProfileUpdation } = useUpdateUserProfile()
    const { data, error, isLoading } = useGetUserProfileQuery()
    const profile = data?.data

    if (isLoading) return <p>Loading...</p>
    if (error || !profile) return <p>Error while loading profile</p>

    const handleImageChange = async (data: FormData) => {
        await handleUpdateImage(data)
    }

    const handleProfileDataUpdation = async (data: UserProfileUpdateDTO) => {
        await handleUpdateData(data)
    }
    console.log(profile)
    return (
        <div className="flex flex-col items-center w-full max-w-xl gap-8 py-10">
            <ProfileImage
                newProfileImage={newImage ?? undefined}
                isGoogle={profile.isGoogle}
                profileImage={profile.profileImage?.path}
                profile_image_url={profile.profile_image_url}
                onChangeImage={() => setChangeImage(true)}
            />
            <CustomerInfo
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

            <CustomerUpdateForm
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