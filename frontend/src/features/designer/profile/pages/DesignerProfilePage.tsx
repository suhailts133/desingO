import { useState } from "react";
import DesignerInfo from "../components/DesignerInfo";
import ProfileImage from "../../../../shared/common/ProfileImage";
import { useGetDesignerProfileQuery } from "../designerProfileEndpoints";
import ProfileImageUploadForm from "../../../../shared/profile/ProfileImageUploadForm";
import DesignerUpdationForm from "../components/DesignerUpdateForm";
import { useChangeProfileImage } from "../hooks/useChangeProfileImage";
import { useUpdateDesignerProfileData } from "../hooks/useUpdateDesignerProfileData";
import type {
  DesignerUpdateResponseDTO,
  IDesignerPreference,
  IDesignerPreferencePayload,
} from "../designerProfileInterface";
import DesignerPreferences from "../components/DesignerPreferences";
import DesignerPreferenceForm from "../components/DesignerPreferenceForm";
import { useUpdatePreference } from "../hooks/useUpdateDesignerPreference";
import { fromOptions } from "../../../../helpers/optionHelper";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";
import Spinner from "../../../../shared/common/Spinner";

export default function DesignerProfilePage() {
  const [changeImage, setChangeImage] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [newData, setNewData] = useState<DesignerUpdateResponseDTO | null>(null);
  const [updateProfile, setUpdateProfile] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPreference, setNewPreference] = useState<IDesignerPreference | undefined>(undefined);
  const { handleUpdateImage, isChanging } = useChangeProfileImage();
  const { handleUpdateData, isUpdating } = useUpdateDesignerProfileData();
  const { handleUpdatePreference, isPreferenceUpdating } = useUpdatePreference();
  const { data, error, isLoading } = useGetDesignerProfileQuery();
  const profile = data?.data;
  const responseHelper = useHandleResponse();
  if (isLoading) return <Spinner />;
  if (error || !profile) return <p>Error while loading profile</p>;

  const handleImageChange = async (data: FormData) => {
    const result = await handleUpdateImage(data);
    responseHelper(result.success, "Profile Image Updated Successfully", result.message);
    if (result.success) {
      setNewImage(result.data as string);
      setChangeImage(false);
    }
  };

  const handleProfileDataUpdation = async (data: DesignerUpdateResponseDTO) => {
    const result = await handleUpdateData(data);
    responseHelper(result.success, "Profile Data Updated Successfully", result.message);
    if (result.success) {
      setNewData(result.data as DesignerUpdateResponseDTO);
      setUpdateProfile(false);
    }
  };
  const handleDesignerPreference = async (payload: IDesignerPreferencePayload) => {
    const data: IDesignerPreference = {
      designStyle: fromOptions(payload.designStyle),
      propertyType: fromOptions(payload.propertyType),
    };

    const result = await handleUpdatePreference(data);
    setNewPreference(result.data ?? undefined);
    setIsEditing(false);
    responseHelper(result.success, "Updated the preference", result.message);
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
      <DesignerInfo newData={newData ?? undefined} profile={profile} onUpdate={() => setUpdateProfile(true)} />

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
        isOpen={changeImage}
        onClose={() => setChangeImage(false)}
        updateImage={handleImageChange}
      />

      <DesignerUpdationForm
        isLoading={isUpdating}
        updateProfileData={handleProfileDataUpdation}
        data={profile}
        isOpen={updateProfile}
        onClose={() => setUpdateProfile(false)}
      />
    </div>
  );
}
