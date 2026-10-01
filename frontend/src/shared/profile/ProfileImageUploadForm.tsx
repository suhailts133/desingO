import { joiResolver } from "@hookform/resolvers/joi";
import { useForm, useWatch } from "react-hook-form";
import { useState, useCallback, useEffect, useMemo } from "react";
import { ImageIcon } from "lucide-react";
import type { IProfileImage } from "../../features/designer/profile/designerProfileInterface";
import { profileImageValidation } from "../../validations/profileValidation";
import ProfileImageCrop from "./ProfileImageCrop";
import { getCroppedImage, type CroppedAreaPixels } from "../../helpers/cropImageHelper";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  updateImage: (data: FormData) => void;
  isLoading: boolean;
};
export default function ProfileImageUploadForm({ onClose, isOpen, updateImage, isLoading }: Props) {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IProfileImage>({
    resolver: joiResolver(profileImageValidation),
    mode: "onBlur",
  });

  const watchedProfileImage = useWatch({ control, name: "profileImage" });
  const selectedFile = watchedProfileImage?.[0];

  const previewSrc = useMemo(() => {
    if (selectedFile instanceof Blob) {
      return URL.createObjectURL(selectedFile);
    }
    return null;
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  const handleClose = useCallback(() => {
    reset();
    setCroppedAreaPixels(null);
    onClose();
  }, [reset, onClose]);

  const handleCropComplete = useCallback((pixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const onSubmit = useCallback(async () => {
    if (!previewSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImage(previewSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("profileImageFile", croppedBlob, "profile.jpg");
      updateImage(formData);
    } catch (err) {
      console.error("Crop/upload failed:", err);
    }
  }, [previewSrc, croppedAreaPixels, updateImage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface border border-surface-border rounded-2xl p-8 animate-in zoom-in duration-200">
        <h2 className="text-4xl font-semibold text-text-primary mb-6 text-center font-Dynalight-Regular">designO</h2>
        <p className="text-center text-lg font-Jost-Semibold text-text-muted mb-6">Change profile image</p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-Jost-Semibold text-text-primary mb-1">Profile Image</label>
            <label
              htmlFor="profileImage"
              className="flex items-center gap-3 w-full bg-surface-hover border border-surface-border rounded-lg px-4 py-2 cursor-pointer hover:border-accent transition-colors"
            >
              <div className="bg-surface p-1.5 rounded-md">
                <ImageIcon className="h-4 w-4 text-text-faint" />
              </div>
              <span className="text-sm text-text-primary font-medium">
                {previewSrc ? "Change profile image" : "Upload profile image"}
              </span>
            </label>
            <input type="file" id="profileImage" hidden accept="image/*" {...register("profileImage")} />
            {errors.profileImage && (
              <p className="text-xs text-error mt-1">{String(errors.profileImage.message ?? "Invalid image")}</p>
            )}
          </div>

          {previewSrc && (
            <div className="w-full space-y-2">
              <span className="text-xs text-text-faint font-bold uppercase">
                Drag to crop · scroll or slide to zoom
              </span>
              <ProfileImageCrop src={previewSrc} onCropComplete={handleCropComplete} />
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            {!isLoading ? (
              <button
                type="submit"
                disabled={!previewSrc || !croppedAreaPixels || isLoading}
                className="w-full py-2.5 bg-accent text-text-on-accent rounded-lg font-medium hover:bg-accent-hover active:bg-accent-active transition-colors disabled:opacity-50"
              >
                Confirm & change
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-2.5 bg-surface-hover text-text-faint rounded-lg font-medium flex items-center justify-center transition-colors"
              >
                <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Changing…
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
