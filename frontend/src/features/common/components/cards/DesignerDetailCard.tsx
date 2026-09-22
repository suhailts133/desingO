import { Calendar, MapPin, User } from "lucide-react";
import type { DesignerCardDTO } from "../../commonInterface";

type Props = {
    designer: DesignerCardDTO
}

export default function DesignerDetailCard({ designer }: Props) {
    const avatarSrc = designer.google_profil_img || designer.profileImg
    
    return (
        <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
            <div className="px-7 py-6 flex gap-6 items-center">

                {/* Avatar */}
                {avatarSrc ? (
                    <img
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        src={avatarSrc}
                        alt={designer.full_name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-surface-border shrink-0"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center shrink-0">
                        <User className="w-8 h-8 text-text-faint" />
                    </div>
                )}

                {/* Vertical divider */}
                <div className="w-px self-stretch bg-surface-border" />

                {/* Info */}
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <h1 className="text-xl font-semibold text-text-primary leading-tight truncate">
                        {designer.full_name}
                    </h1>

                    <div className="flex flex-wrap gap-x-5 gap-y-1">
                        <span className="flex items-center gap-1.5 text-xs text-text-faint">
                            <MapPin size={11} className="text-text-muted shrink-0" />
                            {designer.district}, {designer.state}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-text-faint">
                            <Calendar size={11} className="text-text-muted shrink-0" />
                            Joined {designer.joinedAt}
                        </span>
                    </div>

                    {/* Bio inline below meta */}
                    <p className="text-xs text-text-muted leading-relaxed font-dm-sans-light line-clamp-2 mt-1">
                        {designer.bio || "No bio provided."}
                    </p>
                </div>

            </div>
        </div>
    )
}