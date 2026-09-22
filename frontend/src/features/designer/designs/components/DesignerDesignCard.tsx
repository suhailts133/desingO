import { Eye, Trash, Pencil, ScrollText, Briefcase } from "lucide-react"
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
    const hireRequests = (id: string) => {
        navigate(`/designer/hire-requests/${id}`)
    }
    
    return (
        <div className="group bg-surface w-full rounded-xl border border-surface-border overflow-hidden hover:border-accent transition-colors duration-300">

            {/* Image */}
            <div 
                className="relative overflow-hidden h-48 cursor-pointer" 
                onClick={() => getDesignDetail(design.id)}
            >
                <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={design.coverImage}
                    alt={design.name}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />

                {/* Active job count badge */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-surface/80 text-text-primary px-2.5 py-1 rounded-full text-xxs font-semibold tracking-wide backdrop-blur-sm border border-surface-border">
                    <Briefcase className="w-3 h-3 text-text-muted" />
                    <span>{design.activeJobCount} active</span>
                </div>
            </div>

            <div className="px-5 pt-4 pb-5">

                {/* Title */}
                <button onClick={() => getDesignDetail(design.id)} className="w-full text-left">
                    <h5 className="font-Jost-Semibold mt-1 mb-2 text-lg font-semibold text-text-primary leading-snug group-hover:text-accent-hover transition-colors duration-200 truncate">
                        {design.name}.
                    </h5>
                </button>
                
                {/* price */}
                <span className="text-xs font-medium tracking-widest uppercase text-text-faint block mb-2">
                    Budget - {Number(design.minPrice).toLocaleString("en-IN")} - {Number(design.maxPrice).toLocaleString("en-IN")}
                </span>

                <p className="text-sm font-dm-sans-light text-text-muted leading-relaxed line-clamp-2 mb-5">
                    {design.description}
                </p>
                
                {/* Divider */}
                <div className="h-px bg-surface-border mb-4" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => hireRequests(design.id)}
                        title="Hire Requests"
                        className="shrink-0 inline-flex items-center gap-1.5 bg-accent text-text-on-accent hover:bg-accent-hover px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-colors duration-200"
                    >
                        <ScrollText className="w-3.5 h-3.5" />
                        <span>Requests</span>
                    </button>

                    <button
                        onClick={() => getDesignDetail(design.id)}
                        title="View"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-text-muted bg-surface hover:bg-surface-hover hover:text-text-primary border border-surface-border hover:border-surface-border-strong rounded-lg text-xs font-medium py-2 transition-colors duration-200"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                    </button>
                    <button
                        onClick={() => updateDesignPage(design.id)}
                        title="Edit"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-text-muted bg-surface hover:bg-surface-hover hover:text-text-primary border border-surface-border hover:border-surface-border-strong rounded-lg text-xs font-medium py-2 transition-colors duration-200"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                    </button>

                    <button
                        onClick={onDeleteClick}
                        title="Delete"
                        className="inline-flex items-center justify-center text-text-faint hover:text-error bg-surface hover:bg-error-tint border border-surface-border hover:border-error rounded-lg p-2 transition-colors duration-200"
                    >
                        <Trash className="w-3.5 h-3.5" />
                    </button>
                </div>

            </div>

        </div>
    )
}