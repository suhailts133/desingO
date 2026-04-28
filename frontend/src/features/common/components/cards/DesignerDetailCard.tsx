import { Calendar, MapPin, User } from "lucide-react";
import type { DesignerCardDTO } from "../../commonInterface";

type Props = {
    designer: DesignerCardDTO
}


export default function DesignerDetailCard({ designer }: Props) {
    const avatarSrc = designer.google_profil_img || designer.profileImg
    return (

        <div className="bg-off-white rounded-2xl border border-blush-light/40 overflow-hidden shadow-sm">

            <div className="px-7 py-6 flex gap-6 items-center">

                {/* Avatar */}
                {avatarSrc ? (
                    <img
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        src={avatarSrc}
                        alt={designer.full_name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-blush-light/60 shrink-0 shadow-sm"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-blush-light/20 border-2 border-blush-light/40 flex items-center justify-center shrink-0">
                        <User className="w-8 h-8 text-blush-deep/40" />
                    </div>
                )}

                {/* Vertical divider */}
                <div className="w-px self-stretch bg-blush-light/40" />

                {/* Info */}
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <h1 className="text-xl font-semibold text-soft-black leading-tight truncate">
                        {designer.full_name}
                    </h1>

                    <div className="flex flex-wrap gap-x-5 gap-y-1">
                        <span className="flex items-center gap-1.5 text-xs text-soft-black/45">
                            <MapPin size={11} className="text-blush-deep/50 shrink-0" />
                            {designer.district}, {designer.state}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-soft-black/45">
                            <Calendar size={11} className="text-blush-deep/50 shrink-0" />
                            Joined {designer.joinedAt}
                        </span>
                    </div>

                    {/* Bio inline below meta */}
                    <p className="text-xs text-soft-black/55 leading-relaxed font-dm-sans-light line-clamp-2 mt-1">
                        {designer.bio || "No bio provided."}
                    </p>
                </div>

            </div>
        </div>
    )
}
