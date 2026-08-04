import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SORT_OPTIONS } from "../baseData";
import type { JOBFilterForm } from "../../user/jobs/jobInterface";
import { useGetAllJobsCommonQuery } from "../../user/jobs/jobEndpoints";
import JobCard from "../components/cards/JobCard";
import Pagination from "../../../shared/common/Pagination";
import JobFilter from "../components/filters/JobFilter";


export default function BrowseJobs() {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [page, setPage] = useState(1);

    const { control, watch, reset } = useForm<JOBFilterForm>({
        defaultValues: {
            designStyles: null,
            propertyTypes: null,
            timeLines: null,
            sortBy: SORT_OPTIONS[0],
        },
    });

    const watchedFilters = watch();


    const { data, isLoading, error } = useGetAllJobsCommonQuery({
        ...watchedFilters,
        page
    });

    useEffect(() => {
        setPage(1);
    }, [watchedFilters.designStyles, watchedFilters.propertyTypes, watchedFilters.timeLines, watchedFilters.sortBy]);

    const jobs = data?.data

    console.log(jobs)

    const handleClearAll = () => {
        reset({ designStyles: null, propertyTypes: null, timeLines: null, sortBy: SORT_OPTIONS[0] });
        setPage(1);
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
                control={control}
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
                onDecrease={() => setPage(p => p - 1)}
                onIncrease={() => setPage(p => p + 1)}
            />
        </div>
    );
}