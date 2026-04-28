import {  Plus } from "lucide-react";
import { Link } from "react-router-dom";
import DesignerDesignCard from "../components/DesignerDesignCard";
import { useState } from "react";
import { useGetMyDesignsQuery } from "../designEndpoints";

import { useDeleteADesign } from "../hooks/useDeleteDesign";
import ConfirmModal from "../../../../shared/modals/ConfirmModal";
import Pagination from "../../../../shared/common/Pagination";

export default function Designs() {
    const [page, setPage] = useState(1)
    const [deleteDesign, setDeleteDesign] = useState<string | null>(null)
    const { handleDeletion, isDeleting, deleteError, deleteSuccess } = useDeleteADesign()
    const { data, isLoading, error } = useGetMyDesignsQuery({ page })
    const designs = data?.data;
    if (isLoading) {
        return <p>Loading...</p>
    }
    if (error || !designs) {
        return <p>Error loading designs</p>;
    }

    const handleDelete = async () => {
        if (!deleteDesign) return
    
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
            <ConfirmModal
                isOpen={!!deleteDesign}
                onConfirm={handleDelete}
                onClose={() => setDeleteDesign(null)}
                isLoading={isDeleting}
                text="Are you sure you want to delete this design?"
                heading="Confirm Deletion?"
                buttonLoadingText="deleting"
                buttonText="Confirm & delete"
            />

            <Pagination
            page={page}
            totalItem={totalDesigns}
            totalPages={totalPages}
            whichItem="designs"
            onDecrease={()=> setPage(p => p -1)}
            onIncrease={()=> setPage(p => p +1)}
            />
            
          
        </div>
    );
}