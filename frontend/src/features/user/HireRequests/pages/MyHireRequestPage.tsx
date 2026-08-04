import { ChevronLeft,  } from "lucide-react";
import { useState } from "react";


import { useNavigate, useParams } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css";
import { getDateRange } from "../../../../helpers/getDateRange";
import DateFilterPicker from "../../../../shared/common/DatePickerFilter";

import Pagination from "../../../../shared/common/Pagination";
import type { DateFilter } from "../../../user/jobApplications/jobApplicationInterFace";
import { useMyHireRequestsQuery } from "../hireRequestsEndpoints";
import MyHireRequestCard from "../components/MyHireRequestCard";


export default function MyHireRequestPage() {
    const [page, setPage] = useState(1)
    const [dateFilter, setDateFilter] = useState<DateFilter>("Latest")
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
  

    const { startDate: queryStart, endDate: queryEnd } = getDateRange(dateFilter, startDate, endDate)

    const { data, isLoading, error } = useMyHireRequestsQuery({
        page,
        sort: dateFilter === "Oldest" ? "asc" : "desc",
        startDate: queryStart,
        endDate: queryEnd,
    })
    console.log(data, "Data")
    const navigate = useNavigate()
    const hireRequests = data?.data
    console.log(error, "err")

    if (isLoading) return <p>Loading...</p>
    if (error || !hireRequests) return <p>Error loading hire requests</p>




    const totalHireRequests = data.total ?? 1
    const totalPages = data.totalPages ?? 1

    return (
        <div className="w-full flex flex-col gap-6">
            <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-sm text-soft-black hover:underline">
                <ChevronLeft className="w-4 h-4" />
                Back
            </button>

            {/* Filters Row */}
            <div className="flex flex-wrap items-end gap-4">

                {/* Status Filter */}
                {/* <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-soft-black/50 uppercase tracking-widest">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value as JobApplicationStatus | "All"); setPage(1) }}
                        className="text-xs font-semibold text-soft-black bg-off-white border border-blush-light/40 rounded-lg px-3 py-1.5 focus:outline-none"
                    >
                        {["All", "Pending", "Rejected", "Ongoing"].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div> */}


                <DateFilterPicker
                    dateFilter={dateFilter}
                    startDate={startDate}
                    endDate={endDate}
                    onDateFilterChange={(filter) => { setDateFilter(filter); setPage(1) }}
                    onStartDateChange={(date) => { setStartDate(date); setPage(1) }}
                    onEndDateChange={(date) => { setEndDate(date); setPage(1) }}
                />
            </div>

      

            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hireRequests.map(request => (
                        <MyHireRequestCard
                            request={request}
                            key={request.id}
                        />
                    ))}
                </div>
            </div>

            <Pagination
                page={page}
                totalItem={totalHireRequests}
                whichItem="Hire Requests"
                totalPages={totalPages}
                onDecrease={() => setPage(p => p - 1)}
                onIncrease={() => setPage(p => p + 1)}
            />

        </div>
    );
}