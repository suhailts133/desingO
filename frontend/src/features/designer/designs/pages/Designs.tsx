import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import DesignerDesignCard from "../components/DesignerDesignCard";
import { useState } from "react";
import { useGetAllDesignQuery } from "../designEndpoints";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { useDeleteADesign } from "../hooks/useDeleteDesign";

export default function Designs() {
    const [page, setPage] = useState(1)
    const [deleteDesign, setDeleteDesign] = useState<string | null>(null)
    const { handleDeletion, isDeleting, deleteError, deleteSuccess } = useDeleteADesign()
    const { data, isLoading, error } = useGetAllDesignQuery({ page })
    const designs = data?.data;
    if (isLoading) {
        return <p>Loading...</p>
    }
    if (error || !designs) {
        return <p>Error loading designs</p>;
    }

    const handleDelete = async () => {
        if (!deleteDesign) return
        // console.log(deleteJobRequest)
        console.log(deleteDesign)
        await handleDeletion(deleteDesign)
        setDeleteDesign(null)
    }
    const totalPages = data.totalPages ?? 1;
    const totalDesigns = data.total ?? 1;

    return (
        <div className="w-full flex flex-col gap-6">

            {/* Top bar */}
            <div className="w-full flex justify-end">
                <Link
                    to="/designer/add-design"
                    className="gradient-button flex items-center gap-2"
                >
                    Add new Design <Plus />
                </Link>
            </div>
            {deleteSuccess && (
                <p className="text-green-600 text-sm text-center">{deleteSuccess}</p>
            )}
            {deleteError && (
                <p className="text-red-500 text-sm text-center">{deleteError}</p>
            )}

            <div >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {designs.map(data => (
                        <DesignerDesignCard
                            design={data}
                            onDeleteClick={() => setDeleteDesign(data.id)}
                            key={data.id} />
                    ))}
                </div>

            </div>
            <DeleteConfirmModal
                isOpen={!!deleteDesign}
                onConfirm={handleDelete}
                onClose={() => setDeleteDesign(null)}
                isLoading={isDeleting}
                text="Are you sure you want to delete this design?"
            />
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/20 bg-white/10">
                <p className="text-xs text-soft-black/50">
                    Page {page} of {totalPages} &mdash; {totalDesigns} total designs
                </p>
                <div className="flex items-center gap-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-Jost-Semibold
                bg-blush-light/30 border border-white/40 text-soft-black/90
                hover:bg-white/60 hover:text-blush-deep transition-all duration-200
                disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={14} /> Prev
                    </button>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-Jost-Semibold
                bg-peach/40 border border-white/40 text-soft-black/70
                hover:bg-white/60 hover:text-blush-deep transition-all duration-200
                disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}