import { ChevronLeft,  } from "lucide-react";
import { useState } from "react";


import { useNavigate, useParams } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css";
import { getDateRange } from "../../../../helpers/getDateRange";
import DateFilterPicker from "../../../../shared/common/DatePickerFilter";
import { useHireRequestQuery } from "../designEndpoints";
import HireRequestCard from "../components/HireRequestCard";
import Pagination from "../../../../shared/common/Pagination";
import type { DateFilter } from "../../../user/jobApplications/jobApplicationInterFace";


export default function HireRequestsPage() {
    const [page, setPage] = useState(1)
    const [dateFilter, setDateFilter] = useState<DateFilter>("Latest")
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    // const [approveJobApplication, setApproveJobApplication] = useState<{ id: string, jobId: string } | null>(null)
    // const [rejectJobApplication, setRejectJobApplication] = useState<{ id: string, jobId: string } | null>(null)
    // const { handleApproveOrReject, approvalError, approvalSuccess, isApproving } = useApproveOrRejectJobApplication()
    const { id } = useParams<{ id: string }>();
    const { startDate: queryStart, endDate: queryEnd } = getDateRange(dateFilter, startDate, endDate)

    const { data, isLoading, error } = useHireRequestQuery({
        page,
        designId: id as string,
        sort: dateFilter === "Oldest" ? "asc" : "desc",
        startDate: queryStart,
        endDate: queryEnd,
    }, { skip: !id })

    const navigate = useNavigate()
    const hireRequests = data?.data

    if (isLoading) return <p>Loading...</p>
    if (error || !hireRequests) return <p>Error loading hire requests</p>

    // const handleApproval = async () => {
    //     if (!approveJobApplication) return
    //     await handleApproveOrReject({
    //         id: approveJobApplication.id,
    //         status: "Ongoing",
    //         jobId: approveJobApplication.jobId
    //     })
    //     setApproveJobApplication(null)
    // }

    // const handleRejection = async (data: RejectionPayload) => {
    //     if (!rejectJobApplication) return
    //     await handleApproveOrReject({
    //         id: rejectJobApplication.id,
    //         jobId: rejectJobApplication.jobId,
    //         status: "Rejected",
    //         rejectionReason: data.rejectionReason
    //     })
    //     setRejectJobApplication(null)
    // }



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

            {/* {approvalSuccess && (
                <p className="text-green-600 text-sm text-center">{approvalSuccess}</p>
            )}
            {approvalError && (
                <p className="text-red-500 text-sm text-center">{approvalError}</p>
            )} */}

            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hireRequests.map(request => (
                        <HireRequestCard
                            request={request}
                            key={request.id}
                            onApprove={() => { }}
                            onReject={() => { }}
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

            {/* <ConfirmModal
                isOpen={!!approveJobApplication}
                onConfirm={handleApproval}
                onClose={() => setApproveJobApplication(null)}
                isLoading={isApproving}
                text="Are you sure you want to accept this job Application?"
                heading="Confirm approval?"
                buttonLoadingText="approving"
                buttonText="Confirm & approve"
            />

            <RejectJobApplicationModal
                isOpen={!!rejectJobApplication}
                onClose={() => setRejectJobApplication(null)}
                onConfirm={handleRejection}
            /> */}
        </div>
    );
}