import type { DesignerCardDTO } from "../../commonInterface"
import { useNavigate } from "react-router-dom"
import { ArrowUpRight, MapPin, User } from "lucide-react"

type Props = {
    data: DesignerCardDTO
}

export default function DesignerCard({ data }: Props) {
    const navigate = useNavigate()
    console.log(data)
    const avatarSrc = data.google_profil_img || data.profileImg

    return (
        <div
            onClick={() => navigate(`/designers/${data.designerId}`)}
            className="group bg-off-white w-full h-52 rounded-xl border border-blush-light/40 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
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
                            className="w-12 h-12 rounded-full object-cover border-2 border-blush-light/50 shrink-0"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center shrink-0">
                            <User className="w-6 h-6 text-gray-400" />
                        </div>
                    )}

                    <div className="min-w-0">
                        <h3 className="text-md font-semibold text-soft-black group-hover:text-blush-deep transition-colors duration-200 truncate">
                            {data.full_name}
                        </h3>
                        <p className="text-xxs text-soft-black/40 tracking-wide">Joined {data.joinedAt}</p>
                    </div>

                    <ArrowUpRight
                        size={16}
                        className="ml-auto shrink-0 text-soft-black/30 group-hover:text-blush-deep transition-colors duration-200"
                    />
                </div>

                {/* Divider */}
                <div className="h-px bg-blush-light/40 my-3" />

                {/* Bio */}
                <p className="text-sm font-dm-sans-light text-soft-black/70 leading-relaxed line-clamp-3 flex-1">
                    {data.bio}
                </p>

                {/* Location */}
                <div className="flex items-center gap-1.5 pt-3">
                    <MapPin size={12} className="text-blush-deep/60 shrink-0" />
                    <p className="text-xxs text-soft-black/50 tracking-wide truncate">{data.state}, {data.district}</p>
                </div>

            </div>
        </div>
    )
}