import { useState } from "react"
import CustomerInfo from "../components/CustomerInfo"
import ProfileImage from "../../../../shared/common/ProfileImage"
import { useGetUserProfileQuery } from "../customerProfileEndpoints"
import ProfileImageUploadForm from "../../../../shared/profile/ProfileImageUploadForm"
import CustomerUpdateForm from "../components/CustomerUpdateForm"
import { useChangeProfileImage } from "../../../designer/profile/hooks/useChangeProfileImage"
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile"
import type { UserProfileUpdateDTO } from "../customerProfileInterfaces"
import Spinner from "../../../../shared/common/Spinner"
import { useHandleResponse } from "../../../../helpers/useHandleResponse"

export default function CustomerProfilePage() {
    const [changeImage, setChangeImage] = useState<boolean>(false)
    const [updateProfile, setUpdateProfile] = useState<boolean>(false)
    const [newData, setNewData] = useState<UserProfileUpdateDTO | null>(null)
    const [newImage, setNewImage] = useState<string | null>(null)

    const handleResponse = useHandleResponse()
    const { handleUpdateImage, isChanging } = useChangeProfileImage()
    const { handleUpdateData, isUpdating } = useUpdateUserProfile()
    const { data, error, isLoading } = useGetUserProfileQuery()

    const profile = data?.data

    if (isLoading) return <Spinner />
    if (error || !profile) return <p>Error while loading profile</p>

    const handleImageChange = async (data: FormData) => {
      const result = await handleUpdateImage(data)
      handleResponse(result.success, "Profile Image Updated Successfully", result.message)
      if (result.success) {
        setNewImage(result.data as string)
        setChangeImage(false)
      }
    }

    const handleProfileDataUpdation = async (body: UserProfileUpdateDTO) => {
        const result = await handleUpdateData(body)
        handleResponse(result.success, "Profile updated successfully", result.message)

        if (result.success) {
            setNewData(result.data as UserProfileUpdateDTO)
            setUpdateProfile(false)
        }
    }

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
                isOpen={changeImage}
                onClose={() => setChangeImage(false)}
                updateImage={handleImageChange}
            />

            <CustomerUpdateForm
                isLoading={isUpdating}
                data={profile}
                isOpen={updateProfile}
                onClose={() => setUpdateProfile(false)}
                updateProfileData={handleProfileDataUpdation}
            />
        </div>
    )
}
