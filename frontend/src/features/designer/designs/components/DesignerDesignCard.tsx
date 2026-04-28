import { Eye, Trash, Pencil } from "lucide-react"
import type { DesignResponseDTO } from "../designInterface"
import { useNavigate } from "react-router-dom"

type props = {
    design: DesignResponseDTO,
    onDeleteClick: () => void
}

export default function DesignerDesignCard({ design, onDeleteClick }: props) {
    const navigate = useNavigate();
    const getDesignDetail = (id: string) => {
        navigate(`/designs/${id}`)
    }
    const updateDesignPage = (id: string) => {
        navigate(`/designer/designs/edit/${id}`)
    }
    
    return (
        <div className="group bg-off-white w-full rounded-xl border border-blush-light/40 overflow-hidden shadow-lg  hover:shadow-2xl transition-shadow duration-300 ">

            {/* Image */}
            <div className="relative overflow-hidden h-48">
                <a href="#">
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={design.coverImage}
                        alt={design.name}
                    />
                </a>
                <div className="absolute inset-0 bg-blush/0 group-hover:bg-blush/10 transition-colors duration-300 pointer-events-none" />
            </div>

            <div className="px-5 pt-4 pb-5">


                {/* Title */}
                <a href="#">
                    <h5 className="font-Jost-Semibold mt-1 mb-2 text-lg font-semibold text-soft-black leading-snug hover:text-blush-deep transition-colors duration-200">
                        {design.name}.
                    </h5>
                </a>
                {/* price */}
                <span className="text-xs font-medium tracking-widest uppercase text-blush-deep/70">
                    Starting - {design.price}
                </span>


                <p className="text-sm font-dm-sans-light text-soft-black/70 leading-relaxed line-clamp-2 mb-5">
                    {design.description}
                </p>
                {/* Divider */}
                <div className="h-px bg-soft-black/20 mb-4" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => getDesignDetail(design.id)}
                        title="View"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-soft-black/70 bg-off-white hover:bg-blush-pale hover:text-blush-deep border border-blush-light/50 hover:border-blush-light rounded-lg text-xs font-medium py-2 transition-all duration-200"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                    </button>
                    <button
                        onClick={() => updateDesignPage(design.id)}
                        title="View"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-soft-black/70 bg-off-white hover:bg-blush-pale hover:text-blush-deep border border-blush-light/50 hover:border-blush-light rounded-lg text-xs font-medium py-2 transition-all duration-200"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                    </button>
   
                    <button
                        onClick={onDeleteClick}
                        title="Delete"
                        className="inline-flex items-center justify-center text-soft-black/50 hover:text-error bg-off-white hover:bg-red-50 border border-blush-light/50 hover:border-red-200 rounded-lg p-2 transition-all duration-200"
                    >
                        <Trash className="w-3.5 h-3.5 text-error" />
                    </button>
                </div>

            </div>

        </div>




    )
}

