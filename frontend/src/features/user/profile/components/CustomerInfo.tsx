import type { UserProfileResponseDTO, UserProfileUpdateDTO } from "../customerProfileInterfaces";
import {  Pencil  } from "lucide-react";

interface Props {
    profile: UserProfileResponseDTO;
    onUpdate?: () => void;
    newData?: UserProfileUpdateDTO
}

export default function CustomerInfo({ profile, onUpdate, newData }: Props) {
    const { full_name } = newData ?? profile;


    return (
        <div className="bg-off-white w-full rounded-xl border border-blush-light/40 overflow-hidden shadow-lg">

            {/* Name */}
            <div className="px-5 pt-6 pb-5 flex flex-col items-center gap-2 text-center">
                <h2 className="text-lg font-semibold text-soft-black leading-snug">
                    {full_name}
                </h2>

            </div>

            <div className="h-px bg-blush-light/40" />


            {/* Update button */}
            <div className="h-px bg-blush-light/40" />
            <div className="px-5 py-4">
                <button
                    onClick={onUpdate}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-blush-light/70 bg-blush-pale text-blush-deep text-xxs font-semibold tracking-widest uppercase hover:bg-blush-light/40 transition-colors duration-200"
                >
                    <Pencil size={12} strokeWidth={2.5} />
                    Update Profile
                </button>
            </div>

        </div>
    );
}