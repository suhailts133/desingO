import { useState } from "react";
import { useGetMyJobApplicationsQuery } from "../myJobApplicationEndpoints";
import type { JobApplicationStatus } from "../myJobApplicationInterFace";
import MyJobApplicationCard from "../components/MyJobApplicationCard";
import ConfirmModal from "../../../../shared/modals/ConfirmModal";
import { useDeleteMyJobApplication } from "../hooks/useDeleteMyJobApplication";
import Pagination from "../../../../shared/common/Pagination";
import Spinner from "../../../../shared/common/Spinner";
import type { SortByTypes } from "../../../../api/responseType";
import { useFilterParams } from "../../../../shared/filter/useFilterParams";
import { getDateRange } from "../../../../shared/filter/dateOptions";
import { FilterBar } from "../../../../shared/filter/FilterBar";
import { JOB_APPLICATION_FILTERS } from "../../../user/jobApplications/jobApplicationFilters";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";

export default function MyJobApplications() {
    const { searchParams, getValue, setFilter, setPage } = useFilterParams({ sortBy: "newest" });
    const sortBy = getValue("sortBy") as SortByTypes;
    const status = getValue("status") as JobApplicationStatus | "All";
    const page = Number(searchParams.get("page") ?? "1");
    const { startDate, endDate } = getDateRange(
        getValue("date"),
        getValue("dateFrom", ""),
        getValue("dateTo", "")
    );
    const handleResponse = useHandleResponse()
    const [deleteJobApplication, setDeleteJobApplication] = useState<string | null>(null)
    const { handleDeletion, isDeleting } = useDeleteMyJobApplication();
    const { data, isLoading, error } = useGetMyJobApplicationsQuery({
        page,
        sortBy,
        startDate,
        endDate,
        status,
    })

    const jobApplications = data?.data

    if (isLoading) return <Spinner />
    if (error || !jobApplications) return <p className="text-error p-6 text-center">Error loading job applications</p>

    const handleDelete = async () => {
        if (!deleteJobApplication) return

        console.log(deleteJobApplication)
        const result = await handleDeletion(deleteJobApplication)
        handleResponse(result.success, "You have deleted your job application.", result.message)
        setDeleteJobApplication(null)
    }

    const totalPages = data.totalPages ?? 1
    const totalJobapplications = data.total ?? 1

    return (
        <div className="w-full min-h-full flex flex-col gap-6">
            <FilterBar filters={JOB_APPLICATION_FILTERS} getValue={getValue} onFilterChange={setFilter} />



            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobApplications.map(application => (
                        <MyJobApplicationCard
                            application={application}
                            key={application.id}
                            onDelete={() => setDeleteJobApplication(application.id)}
                        />
                    ))}
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteJobApplication}
                onConfirm={handleDelete}
                onClose={() => setDeleteJobApplication(null)}
                isLoading={isDeleting}
                text="Are you sure you want to delete this job Application?"
                heading="Confirm Deletion?"
                buttonLoadingText="Deleting"
                buttonText="Confirm & delete"
            />

            <div className="sticky bottom-0 mt-auto py-4 bg-bg z-10 border-t border-surface-border">
                <Pagination
                    page={page}
                    totalItem={totalJobapplications}
                    totalPages={totalPages}
                    whichItem="job applications"
                    onDecrease={() => setPage(Math.max(1, page - 1))}
                    onIncrease={() => setPage(Math.min(totalPages, page + 1))}
                />
            </div>

        </div>
    );
}
