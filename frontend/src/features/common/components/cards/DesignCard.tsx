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
        <div className="group bg-off-white w-full rounded-xl border border-blush-light/40 overflow-hidden shadow-lg  hover:shadow-2xl transition-shadow duration-300 ">

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


                <span className="absolute bottom-3 left-3 text-xxs font-semibold tracking-widest uppercase bg-snow-white text-blush-deep px-2.5 py-1 rounded-full border border-blush-light/40">
                    {design.spaceType}
                </span>

                <button
                    onClick={toggleSave}
                    disabled={isToggling}
                    aria-label={isSaved ? "Unsave design" : "Save design"}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-snow-white border border-blush-light/40 
               flex items-center justify-center transition-opacity duration-200 hover:bg-blush-pale
               ${isSaved ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                    <Heart
                        size={14}
                        className={`transition-colors duration-200 ${isSaved
                            ? "fill-blush-deep text-blush-deep"
                            : "text-blush-deep"
                            }`}
                    />
                </button>
            </div>


            <div className="px-4 pt-3.5 pb-4 flex flex-col gap-2">


                <div className="flex flex-wrap gap-1.5">
                    {design.designStyles.map(s => (
                        <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-blush-pale text-blush-deep border border-blush-light/70">{s}</span>
                    ))}
                    {/* <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-blush-pale text-blush-deep border border-blush-light/70">Zen</span> */}
                    {/* <span className="text-xxs font-semibold tracking-wide uppercase px-2.5 py-0.75 rounded-full bg-blush-pale text-blush-deep border border-blush-light/70">Minimal</span> */}
                </div>

                <a href="#">
                    <h3 className="text-md font-semibold leading-snug text-soft-black hover:text-blush-deep transition-colors duration-200 truncate">
                        {design.name}
                    </h3>
                </a>

                <div className="flex items-center gap-1 text-blush-deep/75">
                    <IndianRupee size={11} strokeWidth={2.5} />
                    <span className="text-xs font-semibold tracking-widest uppercase">
                        budget {Number(design.minPrice).toLocaleString("eg-IN")} - {Number(design.maxPrice).toLocaleString("eg-IN")} 
                    </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-blush-light/40" />

                {/* Designer */}
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                        <User className="w-7 h-7 text-gray-400" />
                    </div>
                    <div>
                        <p className="text-[12px] font-semibold text-soft-black leading-tight">{design.designerName}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4].map(i => (
                                <svg key={i} viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="#DDB070" stroke="#DDB070" strokeWidth="1">
                                    <polygon points="5,1 6.18,3.41 9,3.76 7,5.73 7.45,8.5 5,7.22 2.55,8.5 3,5.73 1,3.76 3.82,3.41" />
                                </svg>
                            ))}
                            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="#C8BFB8" strokeWidth="1">
                                <polygon points="5,1 6.18,3.41 9,3.76 7,5.73 7.45,8.5 5,7.22 2.55,8.5 3,5.73 1,3.76 3.82,3.41" />
                            </svg>
                            <span className="text-xxs text-soft-black/40 ml-0.5">(4.0)</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}