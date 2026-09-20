import type { DesignerCardDTO } from "../../commonInterface"
import { useNavigate } from "react-router-dom"
import { ArrowUpRight, MapPin, User } from "lucide-react"

type Props = {
    data: DesignerCardDTO
}

export default function DesignerCard({ data }: Props) {
    const navigate = useNavigate()
    const avatarSrc = data.google_profil_img || data.profileImg

    return (
        <div
            onClick={() => navigate(`/designers/${data.designerId}`)}
            className="group bg-surface w-full h-52 rounded-xl border border-surface-border hover:border-accent overflow-hidden transition-colors duration-300 cursor-pointer"
        >
            <div className="px-4 pt-4 pb-4 flex flex-col h-full">

                {/* Avatar + Name */}
                <div className="flex items-center gap-3">
                    {avatarSrc ? (
                        <img
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            src={avatarSrc}
                            alt={data.full_name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-surface-border shrink-0"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center shrink-0">
                            <User className="w-6 h-6 text-text-faint" />
                        </div>
                    )}

                    <div className="min-w-0">
                        <h3 className="text-md font-semibold text-text-primary group-hover:text-accent-hover transition-colors duration-200 truncate">
                            {data.full_name}
                        </h3>
                        <p className="text-xxs text-text-faint tracking-wide">Joined {data.joinedAt}</p>
                    </div>

                    <ArrowUpRight
                        size={16}
                        className="ml-auto shrink-0 text-text-faint group-hover:text-accent-hover transition-colors duration-200"
                    />
                </div>

                {/* Divider */}
                <div className="h-px bg-surface-border my-3" />

                {/* Bio */}
                <p className="text-sm font-dm-sans-light text-text-muted leading-relaxed line-clamp-3 flex-1">
                    {data.bio}
                </p>

                {/* Location */}
                <div className="flex items-center gap-1.5 pt-3">
                    <MapPin size={12} className="text-accent shrink-0" />
                    <p className="text-xxs text-text-faint tracking-wide truncate">{data.state}, {data.district}</p>
                </div>

            </div>
        </div>
    )
}