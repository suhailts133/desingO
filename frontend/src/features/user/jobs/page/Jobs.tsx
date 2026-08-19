import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { useState } from "react";
import MyJobCard from "../components/MyJobCard";
import { useGetMyJobsQuery } from "../jobEndpoints";
import DeleteConfirmModal from "../../../designer/designs/components/DeleteConfirmModal";
import { useDeleteAJob } from "../hooks/useDeleteAjob";
import Pagination from "../../../../shared/common/Pagination";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";

export default function Jobs() {
    const [page, setPage] = useState(1)
    const [deleteJobRequest, setDeleteJobRequest] = useState<string | null>(null)
    const { data, isLoading, error } = useGetMyJobsQuery({ page, sourceType: "JOB_REQUEST" })
    const { handleDeletion, isDeleting } = useDeleteAJob()
    const jobRequest = data?.data
    const handleResponse = useHandleResponse()
    if (isLoading) {
        return <p>Loading...</p>
    }
    if (error || !jobRequest) {
        return <p>Error loading job requests</p>;
    }


    const handleDelete = async () => {
        if (!deleteJobRequest) return
        const result = await handleDeletion(deleteJobRequest)
        handleResponse(result.success, "Job Request Deleted Successfully", result.message,);
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
            <Pagination
                page={page}
                totalItem={totalJobRequest}
                whichItem="Job Request"
                totalPages={totalPages}
                onDecrease={() => setPage(p => p - 1)}
                onIncrease={() => setPage(p => p + 1)}
            />
        </div>
    );
}