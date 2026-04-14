import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { ImageIcon } from "lucide-react";
import type { IProfileImage } from "../features/designer/profile/designerProfileInterface";
import { profileImageValidation } from "../validations/profileValidation";
import ProfileImageCrop from "./ProfileImageCrop";
import { getCroppedImage, type CroppedAreaPixels } from "../helpers/cropImageHelper";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    updateImage: (data: FormData) => void
    errorMessage?: string
    successMessage?: string,
    isLoading: boolean
};

export default function ProfileImageUploadForm({ onClose, isOpen, updateImage, errorMessage, successMessage, isLoading }: Props) {
    if (!isOpen) return null;

    const [croppedAreaPixels, setCroppedAreaPixels] =
        useState<CroppedAreaPixels | null>(null);

    const { register, handleSubmit, watch, formState: { errors }, } = useForm<IProfileImage>({
        resolver: joiResolver(profileImageValidation),
        mode: "onBlur",
    });

    const watchedProfileImage = watch("profileImage");
    const previewSrc =
        watchedProfileImage?.[0]
            ? URL.createObjectURL(watchedProfileImage[0])
            : null;

    const handleCropComplete = useCallback((pixels: CroppedAreaPixels) => {
        setCroppedAreaPixels(pixels);
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, onClose]);

    const onSubmit = async () => {
        if (!previewSrc || !croppedAreaPixels) return;
        try {
            const croppedBlob = await getCroppedImage(previewSrc, croppedAreaPixels);

            const formData = new FormData();
            formData.append("profileImageFile", croppedBlob, "profile.jpg");
            updateImage(formData)

        } catch (err) {
            console.error("Crop/upload failed", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-soft-black mb-6 text-center font-Dynalight-Regular">
                    designO
                </h2>
                <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">
                    Change profile image
                </p>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* File input */}
                    <div>
                        <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">
                            Profile Image
                        </label>
                        <label
                            htmlFor="profileImage"
                            className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors"
                        >
                            <div className="bg-gray-100 p-1.5 rounded-md">
                                <ImageIcon className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                                {watchedProfileImage?.length > 0
                                    ? "Change profile image"
                                    : "Upload profile image"}
                            </span>
                        </label>
                        <input
                            type="file"
                            id="profileImage"
                            hidden
                            accept="image/*"
                            {...register("profileImage")}
                        />
                        {errors.profileImage && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.profileImage.message}
                            </p>
                        )}
                    </div>


                    {previewSrc && (
                        <div className="w-full space-y-2">
                            <span className="text-xs text-gray-400 font-bold uppercase">
                                Drag to crop · scroll or slide to zoom
                            </span>
                            <ProfileImageCrop
                                src={previewSrc}
                                onCropComplete={handleCropComplete}
                            />
                        </div>
                    )}


                    <div className="flex flex-col gap-3 pt-4">
                        {!isLoading ? (
                            <button
                                type="submit"
                                disabled={!previewSrc || !croppedAreaPixels || isLoading}
                                className="auth-button disabled:opacity-50"
                            >
                                Confirm & change
                            </button>
                        ) : (
                            <button type="submit" disabled className="auth-disabled-button">
                                <svg
                                    className="mr-2 size-5 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                Changing…
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-800 text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                    {errorMessage && <p className="text-sm text-error text-center">{errorMessage}</p>}
                    {successMessage && <p className="text-sm text-success text-center">{successMessage}</p>}
                </form>
            </div>
        </div>
    );
}