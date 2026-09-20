import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
    page:number
    totalPages:number
    totalItem:number
    whichItem:string
    onIncrease:() => void
    onDecrease:() => void
}

export default function Pagination({page, totalItem, totalPages, onDecrease, onIncrease, whichItem}:Props) {
    return (
     
            <div className=" flex items-center justify-between px-5 py-3.5 border-t border-surface-border bg-surface">
                <p className="text-xs text-text-faint">
                    Page {page} of {totalPages} &mdash; {totalItem} total {whichItem}
                </p>
                <div className="flex items-center gap-2">
                    <button
                        disabled={page <= 1}
                        onClick={onDecrease}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-Jost-Semibold
                                bg-surface-hover border border-surface-border text-text-muted
                                hover:bg-surface-border-strong hover:text-accent-hover transition-all duration-200
                                disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={14} /> Prev
                    </button>
                    <button
                        disabled={page >= totalPages}
                        onClick={onIncrease}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-Jost-Semibold
                                bg-surface-hover border border-surface-border text-text-muted
                                hover:bg-surface-border-strong hover:text-accent-hover transition-all duration-200
                                disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next <ChevronRight size={14} />
                    </button>
                </div>
            </div>
    
    )
}