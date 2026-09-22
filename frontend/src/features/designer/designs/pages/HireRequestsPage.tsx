import { ChevronLeft, } from "lucide-react";
import { useState } from "react";


import { useNavigate, useParams } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css";
import { getDateRange } from "../../../../helpers/getDateRange";
import DateFilterPicker from "../../../../shared/common/DatePickerFilter";
import { useHireRequestQuery } from "../designEndpoints";
import HireRequestCard from "../components/HireRequestCard";
import Pagination from "../../../../shared/common/Pagination";
import type { DateFilter, RejectionPayload } from "../../../user/jobApplications/jobApplicationInterFace";
import ConfirmModal from "../../../../shared/modals/ConfirmModal";
import RejectJobApplicationModal from "../../../user/jobApplications/components/RejectJobApplicationModal";
import { useApproveOrRejectHireRequest } from "../hooks/useApproveOrRejectHireRequest";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";


export default function HireRequestsPage() {
    const [page, setPage] = useState(1)
    const [dateFilter, setDateFilter] = useState<DateFilter>("Latest")
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const [approveHireRequest, setApproveHireRequest] = useState<{ hireRequestId: string } | null>(null)
    const [rejectHireRequest, setRejectHireRequest] = useState<{ hireRequestId: string } | null>(null)
    const { handleSubmission, isApproveOrReject } = useApproveOrRejectHireRequest()
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
    const handleResponse = useHandleResponse()
    const hireRequests = data?.data

    if (isLoading) return <p className="text-text-faint">Loading...</p>
    if (error || !hireRequests) return <p className="text-error">Error loading hire requests</p>

    const handleApproval = async () => {
        if (!approveHireRequest) return
        const result = await handleSubmission({ status: "Accepted", requestId: approveHireRequest.hireRequestId })
        handleResponse(result.success, "You have accepted this request.", result.message)
        setApproveHireRequest(null)
    }

    const handleRejection = async (data: RejectionPayload) => {
        if (!rejectHireRequest) return
        const result = await handleSubmission({ requestId: rejectHireRequest.hireRequestId, status: "Rejected", rejectionReason: data.rejectionReason })
        handleResponse(result.success, "You have reject this request.", result.message)
        setRejectHireRequest(null)
    }

    const totalHireRequests = data.total ?? 1
    const totalPages = data.totalPages ?? 1

    return (
        <div className="w-full flex flex-col gap-6">

            <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-sm w-fit text-accent hover:text-accent-hover transition-colors">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
            </button>

            {/* Filters Row */}
            <div className="flex flex-wrap items-end gap-4">

                {/* Status Filter */}
                {/* <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-text-faint uppercase tracking-widest">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value as JobApplicationStatus | "All"); setPage(1) }}
                        className="text-xs font-semibold text-text-primary bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors cursor-pointer"
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
                        <HireRequestCard
                            request={request}
                            key={request.id}
                            onApprove={() => setApproveHireRequest({ hireRequestId: request.id })}
                            onReject={() => setRejectHireRequest({ hireRequestId: request.id })}
                        />
                    ))}
                </div>
            </div>

            <div className="sticky bottom-0 mt-auto pt-4 bg-bg">
                <Pagination
                    page={page}
                    totalItem={totalHireRequests}
                    whichItem="Hire Requests"
                    totalPages={totalPages}
                    onDecrease={() => setPage(p => p - 1)}
                    onIncrease={() => setPage(p => p + 1)}
                />
            </div>

            <ConfirmModal
                isOpen={!!approveHireRequest}
                onConfirm={handleApproval}
                onClose={() => setApproveHireRequest(null)}
                isLoading={isApproveOrReject}
                text="Are you sure you want to accept this request?"
                heading="Confirm?"
                buttonLoadingText="Accepting"
                buttonText="Confirm & Accept"
            />

            <RejectJobApplicationModal
                isOpen={!!rejectHireRequest}
                onClose={() => setRejectHireRequest(null)}
                onConfirm={handleRejection}
                isLoading={isApproveOrReject}
            />
        </div>
    );
}