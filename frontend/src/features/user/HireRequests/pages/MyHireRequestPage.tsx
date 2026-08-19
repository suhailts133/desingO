import { useState } from "react";
import MyJobCard from "../../jobs/components/MyJobCard";
import { useGetMyJobsQuery } from "../../jobs/jobEndpoints";
import { useDeleteAJob } from "../../jobs/hooks/useDeleteAjob";
import DeleteConfirmModal from "../../../designer/designs/components/DeleteConfirmModal";
import Pagination from "../../../../shared/common/Pagination";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";

export default function MyHireRequestPage() {
    const [page, setPage] = useState(1)
    const [deleteHireRequest, setDeleteHireRequest] = useState<string | null>(null)
    const { data, isLoading, error } = useGetMyJobsQuery({ page, sourceType: "DIRECT_HIRE" })
    const { handleDeletion, isDeleting, } = useDeleteAJob()
    const jobRequest = data?.data
    const handleResponse = useHandleResponse()
    if (isLoading) {
        return <p>Loading...</p>
    }
    if (error || !jobRequest) {
        return <p>Error loading hire requests</p>;
    }

    const handleDelete = async () => {
        if (!deleteHireRequest) return
        const result  = await handleDeletion(deleteHireRequest)
        handleResponse(result.success, "Hire Request Deleted Successfully",  result.message, ); 
        setDeleteHireRequest(null)
    }
    const totalPages = data.totalPages ?? 1;
    const totalJobRequest = data.total ?? 1;

    return (
        <div className="w-full flex flex-col gap-6">

            {/* Top bar */}
            <div className="w-full flex justify-end">

            </div>
          

            <div >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobRequest.map(data => (
                        <MyJobCard
                            jobRequest={data}
                            onDeleteClick={() => setDeleteHireRequest(data.id)}
                            key={data.id}
                        />
                    ))}
                </div>

            </div>
            <DeleteConfirmModal
                isOpen={!!deleteHireRequest}
                onConfirm={handleDelete}
                onClose={() => setDeleteHireRequest(null)}
                isLoading={isDeleting}
                text="Are you sure you want to delete this hire request?"
            />
            <Pagination
                page={page}
                totalItem={totalJobRequest}
                whichItem="hire request"
                totalPages={totalPages}
                onDecrease={() => setPage(p => p - 1)}
                onIncrease={() => setPage(p => p + 1)}
            />


        </div>
    );
}