import { useState } from "react";
import Pagination from "../../../shared/common/Pagination";
import { useGetCustomerActiveJobsQuery } from "./CustomerActiveJobEndpoints";
import ActiveJobCard from "../../../shared/common/ActiveJobCard";

export default function CustomerActiveJobPage() {
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState<'jobRequest' | 'direct_hire'>("jobRequest")
    const { data, isLoading, error } = useGetCustomerActiveJobsQuery({
        page,
        sourceType: status

    })


    const activeJobs = data?.data

    if (isLoading) return <p>Loading...</p>
    if (error || !activeJobs) return <p>Error loading  active Jobs</p>



    const totalPages = data.totalPages ?? 1
    const totalActiveJobs = data.total ?? 1

    return (
        <div className="w-full flex flex-col gap-6">

       
            <div className="flex items-center gap-2 bg-off-white border border-blush-light/40 rounded-xl p-1 w-fit">
                {(["jobRequest", "direct_hire"] as const).map(s => (
                    <button
                        key={s}
                        onClick={() => { setStatus(s); setPage(1) }}
                        className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-200
                ${status === s
                                ? "bg-white text-blush-deep border border-blush-light/60 shadow-sm"
                                : "text-soft-black/50 hover:text-soft-black"
                            }`}
                    >
                        {s === "jobRequest" ? "Job request" : "Direct hire"}
                    </button>
                ))}
            </div>



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


            <Pagination
                page={page}
                totalItem={totalActiveJobs}
                totalPages={totalPages}
                whichItem="Active Jobs"
                onDecrease={() => setPage(p => p - 1)}
                onIncrease={() => setPage(p => p + 1)}
            />


        </div>
    );
}
