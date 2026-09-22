import { ArrowUpRight } from "lucide-react"
import type { DesignGallaryDTO } from "../commonInterface"
import { useNavigate } from "react-router-dom"

type Props = {
    totalDesigns: number,
    design: DesignGallaryDTO[]
}

export default function Gallary({ totalDesigns, design }: Props) {
    const navigate = useNavigate()

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text-primary tracking-wide">Works</h2>
                <span className="text-xs text-text-muted bg-surface-hover border border-surface-border rounded-full px-3 py-0.5">
                    {totalDesigns} total
                </span>
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {design.map(item => (
                    <div
                        key={item.designId}
                        onClick={() => navigate(`/designs/${item.designId}`)}
                        className="group relative aspect-square rounded-2xl overflow-hidden border border-surface-border cursor-pointer bg-surface transition-all duration-300 ease-out hover:border-accent"
                    >
                        {/* Image */}
                        <img
                            src={item.coverImage}
                            alt="Design"
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />

                        {/* Bottom gradient + label on hover */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Arrow badge */}
                        <div className="absolute bottom-2.5 right-2.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                            <div className="w-7 h-7 rounded-full bg-surface border border-surface-border flex items-center justify-center">
                                <ArrowUpRight size={13} className="text-text-primary group-hover:text-accent transition-colors" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}