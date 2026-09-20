import { Heart, IndianRupee, User } from "lucide-react"
import type { GetAllDesignCommonResponseDTO } from "../../../designer/designs/designInterface"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useToggleSaveDesign } from "../../hooks/useToggleSaveDesign"


type Props = {
    design: GetAllDesignCommonResponseDTO
}

export default function DesignCard({ design }: Props) {
    const navigate = useNavigate()
    const [isSaved, setIsSaved] = useState(design.isSaved)
    const {isToggling, savedError, handleToggling} = useToggleSaveDesign()
    const toggleSave = async (e: React.MouseEvent) => {
        e.stopPropagation()
        const result = await handleToggling({designId:design.id, isSaved:!isSaved})
        if(result !== undefined){
            setIsSaved(result)
        }
    }
    const getDesignDetail = (id: string) => {
        navigate(`/designs/${id}`)
    }
    console.log(savedError)
    return (
        <div className="group bg-surface w-full rounded-xl overflow-hidden border border-surface-border hover:border-accent transition-colors duration-300">

            <div className="relative overflow-hidden h-52">
                <button
                    onClick={() => getDesignDetail(design.id)}
                    className="w-full h-full cursor-pointer"
                    aria-label={`View details for ${design.name}`}
                >
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115"
                        src={design.coverImage}
                        alt={design.name}
                    />
                </button>


                <span className="absolute bottom-3 left-3 text-xxs font-semibold tracking-widest uppercase bg-accent-tint text-accent-tint-text px-2.5 py-1 rounded-full border border-surface-border">
                    {design.spaceType}
                </span>

                <button
                    onClick={toggleSave}
                    disabled={isToggling}
                    aria-label={isSaved ? "Unsave design" : "Save design"}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-surface border border-surface-border 
               flex items-center justify-center transition-opacity duration-200 hover:bg-surface-hover
               ${isSaved ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                    <Heart
                        size={14}
                        className={`transition-colors duration-200 ${isSaved
                            ? "fill-accent text-accent"
                            : "text-accent"
                            }`}
                    />
                </button>
            </div>


            <div className="px-4 pt-3.5 pb-4 flex flex-col gap-2">


                <div className="flex flex-wrap gap-1.5">
                    {design.designStyles.map(s => (
                        <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-accent-tint text-accent-tint-text border border-surface-border">{s}</span>
                    ))}
                    {/* <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-accent-tint text-accent-tint-text border border-surface-border">Zen</span> */}
                    {/* <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-accent-tint text-accent-tint-text border border-surface-border">Minimal</span> */}
                </div>

                <a href="#">
                    <h3 className="text-md font-semibold leading-snug text-text-primary hover:text-accent-hover transition-colors duration-200 truncate">
                        {design.name}
                    </h3>
                </a>

                <div className="flex items-center gap-1 text-accent">
                    <IndianRupee size={11} strokeWidth={2.5} />
                    <span className="text-xs font-semibold tracking-widest uppercase">
                        budget {Number(design.minPrice).toLocaleString("eg-IN")} - {Number(design.maxPrice).toLocaleString("eg-IN")} 
                    </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-surface-border" />

                {/* Designer */}
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-surface-hover border-2 border-surface-border flex items-center justify-center">
                        <User className="w-7 h-7 text-text-faint" />
                    </div>
                    <div>
                        <p className="text-[12px] font-semibold text-text-primary leading-tight">{design.designerName}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4].map(i => (
                                <svg key={i} viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="var(--color-accent)" stroke="var(--color-accent)" strokeWidth="1">
                                    <polygon points="5,1 6.18,3.41 9,3.76 7,5.73 7.45,8.5 5,7.22 2.55,8.5 3,5.73 1,3.76 3.82,3.41" />
                                </svg>
                            ))}
                            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="var(--color-text-faint)" strokeWidth="1">
                                <polygon points="5,1 6.18,3.41 9,3.76 7,5.73 7.45,8.5 5,7.22 2.55,8.5 3,5.73 1,3.76 3.82,3.41" />
                            </svg>
                            <span className="text-xxs text-text-faint ml-0.5">(4.0)</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}