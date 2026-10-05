import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { useState } from "react";
import MyJobCard from "../components/MyJobCard";
import { useGetMyJobsQuery } from "../jobEndpoints";
import DeleteConfirmModal from "../../../designer/designs/components/DeleteConfirmModal";
import { useDeleteAJob } from "../hooks/useDeleteAjob";
import Pagination from "../../../../shared/common/Pagination";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";
import Spinner from "../../../../shared/common/Spinner";
import { FilterBar } from "../../../../shared/filter/FilterBar";
import { JOB_FILTERS } from "../jobFilter";
import { useFilterParams } from "../../../../shared/filter/useFilterParams";
import { getDateRange } from "../../../../shared/filter/dateOptions";
import type { SortByTypes } from "../../../../api/responseType";
import type { JobStatus } from "../jobInterface";

export default function Jobs() {
    const [deleteJobRequest, setDeleteJobRequest] = useState<string | null>(null)
    const { handleDeletion, isDeleting } = useDeleteAJob()

    const { searchParams, getValue, setFilter, setPage } = useFilterParams({ sortBy: "newest" });
    const projectTitle = searchParams.get("projectTitle");
    const sortBy = getValue("sortBy") as SortByTypes;
    const status = getValue("status") as JobStatus | "All";
    const page = Number(searchParams.get("page") ?? "1");
    const { startDate, endDate } = getDateRange(
        getValue("date"),
        getValue("dateFrom", ""),
        getValue("dateTo", "")
    );
  


    const { data, isLoading, error } = useGetMyJobsQuery({ 
        page,
         sourceType: "JOB_REQUEST",
         sortBy,
         status,
         startDate,
         endDate,
         projectTitle:projectTitle || undefined
        
        })
    const jobRequest = data?.data
    const handleResponse = useHandleResponse()
    if (isLoading) {
        return <Spinner />
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
    <div className="w-full min-h-full flex flex-col gap-6">

            {/* Top bar */}
            <div className="w-full flex justify-end">
                <Link
                    to="/customer/add-job"
                    className="gradient-button flex items-center gap-2"
                >
                    Add new job <Plus />
                </Link>
            </div>

            <FilterBar filters={JOB_FILTERS} getValue={getValue} onFilterChange={setFilter} />


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


            <div className="mt-auto pt-4">
                <Pagination
                    page={page}
                    totalItem={totalJobRequest}
                    whichItem="Job Request"
                    totalPages={totalPages}
                    onDecrease={() => setPage(Math.max(1, page - 1))}
                    onIncrease={() => setPage(Math.min(totalPages, page + 1))}
                />
            </div>

        </div>
    );
}
