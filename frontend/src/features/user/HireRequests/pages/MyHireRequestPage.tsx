import { useState } from "react";
import MyJobCard from "../../jobs/components/MyJobCard";
import { useGetMyJobsQuery } from "../../jobs/jobEndpoints";
import { useDeleteAJob } from "../../jobs/hooks/useDeleteAjob";
import DeleteConfirmModal from "../../../designer/designs/components/DeleteConfirmModal";
import Pagination from "../../../../shared/common/Pagination";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";
import Spinner from "../../../../shared/common/Spinner";
import { useFilterParams } from "../../../../shared/filter/useFilterParams";
import type { SortByTypes } from "../../../../api/responseType";
import type { JobStatus } from "../../jobs/jobInterface";
import { getDateRange } from "../../../../shared/filter/dateOptions";
import { FilterBar } from "../../../../shared/filter/FilterBar";
import { JOB_FILTERS } from "../../jobs/jobFilter";

export default function MyHireRequestPage() {
    const [deleteHireRequest, setDeleteHireRequest] = useState<string | null>(null)

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
        sourceType: "DIRECT_HIRE",
        sortBy,
        status,
        startDate,
        endDate,
        projectTitle: projectTitle || undefined

    })
    const { handleDeletion, isDeleting, } = useDeleteAJob()
    const jobRequest = data?.data
    const handleResponse = useHandleResponse()
    if (isLoading) {
        return <Spinner />
    }
    if (error || !jobRequest) {
        return <p>Error loading hire requests</p>;
    }

    const handleDelete = async () => {
        if (!deleteHireRequest) return
        const result = await handleDeletion(deleteHireRequest)
        handleResponse(result.success, "Hire Request Deleted Successfully", result.message,);
        setDeleteHireRequest(null)
    }
    const totalPages = data.totalPages ?? 1;
    const totalJobRequest = data.total ?? 1;

    return (
        <div className="w-full min-h-full flex flex-col gap-6">

            {/* Top bar */}
            <div className="w-full flex justify-end">

            </div>

            <FilterBar filters={JOB_FILTERS} getValue={getValue} onFilterChange={setFilter} />



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


            <div className="mt-auto pt-4">
                <Pagination
                    page={page}
                    totalItem={totalJobRequest}
                    whichItem="hire request"
                    totalPages={totalPages}
                    onDecrease={() => setPage(Math.max(1, page - 1))}
                    onIncrease={() => setPage(Math.min(totalPages, page + 1))}
                />

            </div>


        </div>
    );
}
