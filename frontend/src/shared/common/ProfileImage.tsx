import { User } from "lucide-react";

interface Props {
    isGoogle: boolean;
    profileImage?: string;
    profile_image_url?: string;
    newProfileImage?:string
    onChangeImage?: () => void;
}

export default function ProfileImage({ isGoogle, profileImage, profile_image_url, onChangeImage,newProfileImage }: Props) {
    const src = newProfileImage ?? (isGoogle ? profile_image_url : profileImage ?? undefined);

    return (
        <div className="relative w-20 h-20 shrink-0">
            {src ? (
                <img
                    src={src}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="w-20 h-20 rounded-full object-cover border border-gray-200"
                />
            ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                </div>
            )}

            {!isGoogle && (
                <button
                    onClick={onChangeImage}
                    className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors hover:cursor-pointer"
                    aria-label="Change profile image"
                >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M11.5 2.5a1.5 1.5 0 0 1 2.121 2.121l-8.5 8.5L3 14l.879-2.121 8.5-8.5z"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            )}



        </div>
    );
}