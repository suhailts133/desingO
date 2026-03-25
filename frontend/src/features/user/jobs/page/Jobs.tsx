import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { useState } from "react";
import MyJobCard from "../components/MyJobCard";
import { useGetMyJobsQuery } from "../jobEndpoints";
import DeleteConfirmModal from "../../../designer/designs/components/DeleteConfirmModal";
import { useDeleteAJob } from "../hooks/useDeleteAjob";

export default function Jobs() {
    const [page, setPage] = useState(1)
    const [deleteJobRequest, setDeleteJobRequest] = useState<string | null>(null)
    const { data, isLoading, error } = useGetMyJobsQuery({ page })
    const { handleDeletion, isDeleting, deleteError, deleteSuccess } = useDeleteAJob()
    const jobRequest = data?.data
    if (isLoading) {
        return <p>Loading...</p>
    }
    if (error || !jobRequest) {
        return <p>Error loading job requests</p>;
    }

    const handleDelete = async () => {
        if (!deleteJobRequest) return
        // console.log(deleteJobRequest)
        console.log(deleteJobRequest)
        await handleDeletion(deleteJobRequest)
        setDeleteJobRequest(null)
    }
    const totalPages = data.totalPages ?? 1;
    const totalJobRequest = data.total ?? 1;

    return (
        <div className="w-full flex flex-col gap-6">

            {/* Top bar */}
            <div className="w-full flex justify-end">
                <Link
                    to="/customer/add-job"
                    className="gradient-button flex items-center gap-2"
                >
                    Add new job <Plus />
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
                    {jobRequest.map(data => (
                        <MyJobCard
                            jobRequest={data}
                            onDeleteClick={() => setDeleteJobRequest(data.id)}
                            key={data.id}
                        />
                    ))}
                </div>

            </div>
            <DeleteConfirmModal
                isOpen={!!deleteJobRequest}
                onConfirm={handleDelete}
                onClose={() => setDeleteJobRequest(null)}
                isLoading={isDeleting}
                text="Are you sure you want to delete this Job Request?"
            />
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/20 bg-white/10">
                <p className="text-xs text-soft-black/50">
                    Page {page} of {totalPages} &mdash; {totalJobRequest} total designs
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