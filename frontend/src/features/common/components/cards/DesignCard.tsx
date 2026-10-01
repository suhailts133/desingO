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

            </div>
        </div>
    )
}
