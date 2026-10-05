import Pagination from "../../../shared/common/Pagination";
import { useGetCustomerActiveJobsQuery } from "./CustomerActiveJobEndpoints";
import ActiveJobCard from "../../../shared/common/ActiveJobCard";
import Spinner from "../../../shared/common/Spinner";
import { FilterBar } from "../../../shared/filter/FilterBar";
import { ACTIVE_JOBS_FILTERS } from "../../designer/activeJobs/ActiveJobFilters";
import { getDateRange } from "../../../shared/filter/dateOptions";
import { useFilterParams } from "../../../shared/filter/useFilterParams";
import type { SortByTypes } from "../../../api/responseType";

export default function CustomerActiveJobPage() {
    const { searchParams, getValue, setFilter, setPage } = useFilterParams({ sortBy: "newest" });
    const sourceName = searchParams.get("sourceName");
    const sortBy = getValue("sortBy") as SortByTypes;
    const status = getValue("status") as 'Active' | 'Completed' | 'Cancelled' | "Terminated" | "All";
    const proposalStatus = getValue("proposalStatus") as "NOT_CREATED" | "CREATED" | "REJECTED" | "All";
    const sourceType = getValue("sourceType") as 'jobRequest' | 'direct_hire' | "All";
    const page = Number(searchParams.get("page") ?? "1");
    const { startDate, endDate } = getDateRange(
        getValue("date"),
        getValue("dateFrom", ""),
        getValue("dateTo", "")
    );
    const { data, isLoading, error } = useGetCustomerActiveJobsQuery({
        sourceName: sourceName || undefined,
        sourceType,
        sortBy,
        startDate,
        endDate,
        status,
        proposalStatus,
        page

    })

    const activeJobs = data?.data

    if (isLoading) return <Spinner />
    if (error || !activeJobs) return <p>Error loading  active Jobs</p>



    const totalPages = data.totalPages ?? 1
    const totalActiveJobs = data.total ?? 1

    return (
        <div className="w-full min-h-full flex flex-col gap-6">

            <FilterBar filters={ACTIVE_JOBS_FILTERS} getValue={getValue} onFilterChange={setFilter} />



            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeJobs.map(job => (
                        <ActiveJobCard
                            key={job.id}
                            data={job}
                        />
                    ))}
                </div>
            </div>


            <div className="mt-auto pt-4">
                <Pagination
                    page={page}
                    totalItem={totalActiveJobs}
                    totalPages={totalPages}
                    whichItem="Active Jobs"
                    onDecrease={() => setPage(Math.max(1, page - 1))}
                    onIncrease={() => setPage(Math.min(totalPages, page + 1))}
                />

            </div>


        </div>
    );
}
