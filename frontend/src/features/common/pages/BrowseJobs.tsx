import { useState } from "react";
import { SORT_OPTIONS } from "../baseData";
import { useGetAllJobsCommonQuery } from "../../user/jobs/jobEndpoints";
import JobCard from "../components/cards/JobCard";
import Pagination from "../../../shared/common/Pagination";
import JobFilter from "../components/filters/JobFilter";
import { useSearchParams } from "react-router-dom";
import { createFilterChangeHandler } from "../../../helpers/handleFilterChagne";


export default function BrowseJobs() {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") ?? "1");
    const sortByValue = searchParams.get("sortBy") ?? SORT_OPTIONS[0].value;
    const designStylesParam = searchParams.get("designStyles");
    const propertyTypesParam = searchParams.get("propertyTypes");
    const timeLinesParam = searchParams.get("timeLines");


    const designStyles = designStylesParam ? designStylesParam.split(",").map((v) => ({ label: v, value: v })) : null;
    const propertyTypes = propertyTypesParam ? propertyTypesParam.split(",").map((v) => ({ label: v, value: v })) : null;
    const timeLines = timeLinesParam ? timeLinesParam.split(",").map((v) => ({ label: v, value: v })) : null;
    const selectedSort = SORT_OPTIONS.find((s) => s.value === sortByValue) ?? SORT_OPTIONS[0];


    const { data, isLoading, error } = useGetAllJobsCommonQuery({
        page,
        designStyles,
        propertyTypes,
        timeLines,
        sortBy: selectedSort,
    });


    const jobs = data?.data

    const onFilterChange = createFilterChangeHandler(setSearchParams);
    const handlePageChange = (newPage: number) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", String(newPage));
            return next;
        });
    };

    const handleClearAll = () => {
        setSearchParams({ page: "1" });
    };

    if (isLoading) {
        return <div className="p-10 text-center animate-pulse text-gray-400 font-Jost">Loading jobs...</div>;
    }

    if (error || !jobs) {
        return <div className="p-10 text-center text-red-500 font-Jost-Semibold">Error loading jobs.</div>;
    }

    const totalJobs = data.total ?? 0
    const totalPages = data.totalPages ?? 1

    return (
        <div className="min-h-screen bg-gray-50/60 font-Jost">

            <JobFilter
                designStyles={designStyles}
                propertyTypes={propertyTypes}
                timeLines={timeLines}
                sortBy={selectedSort}
                onFilterChange={onFilterChange}
                onClear={handleClearAll}
                filtersVisible={filtersVisible}
                setFiltersVisible={setFiltersVisible}
            />


            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {jobs.map(data => (
                        <JobCard job={data} key={data.id} />
                    ))}
                </div>
            </div>

            {/* ── Pagination ── */}

            <Pagination
                page={page}
                totalItem={totalJobs}
                whichItem="jobs"
                totalPages={totalPages}
                onDecrease={() => handlePageChange(Math.max(1, page - 1))}
                onIncrease={() => handlePageChange(Math.min(totalPages, page + 1))}
            />
        </div>
    );
}