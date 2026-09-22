import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import JobApplicationCard from "../../jobApplications/components/JobApplicationCard";
import { useGetAllJobApplicationsQuery } from "../jobApplicationEndpoints";
import type { DateFilter, RejectionPayload, JobApplicationStatus } from "../jobApplicationInterFace";
import ConfirmModal from "../../../../shared/modals/ConfirmModal";
import { useApproveOrRejectJobApplication } from "../hooks/useApproveOrRejectionJobApplication";
import RejectJobApplicationModal from "../components/RejectJobApplicationModal";
import { useNavigate, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { getDateRange } from "../../../../helpers/getDateRange";
import DateFilterPicker from "../../../../shared/common/DatePickerFilter";
import Pagination from "../../../../shared/common/Pagination";


export default function JobApplications() {
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState<JobApplicationStatus | "All">("All")
    const [dateFilter, setDateFilter] = useState<DateFilter>("Latest")
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [approveJobApplication, setApproveJobApplication] = useState<{ id: string, jobId: string } | null>(null)
    const [rejectJobApplication, setRejectJobApplication] = useState<{ id: string, jobId: string } | null>(null)
    const { handleApproveOrReject, approvalError, approvalSuccess, isApproving } = useApproveOrRejectJobApplication()
    const { id } = useParams<{ id: string }>();
    const { startDate: queryStart, endDate: queryEnd } = getDateRange(dateFilter, startDate, endDate)

    const { data, isLoading, error } = useGetAllJobApplicationsQuery({
        page,
        status: status === "All" ? undefined : status,
        id: id as string,
        sort: dateFilter === "Oldest" ? "asc" : "desc",
        startDate: queryStart,
        endDate: queryEnd,
    }, { skip: !id })

    const navigate = useNavigate()
    const jobApplications = data?.data

    if (isLoading) return <p className="text-text-faint">Loading...</p>
    if (error || !jobApplications) return <p className="text-error">Error loading job applications</p>

    const handleApproval = async () => {
        if (!approveJobApplication) return
        await handleApproveOrReject({
            id: approveJobApplication.id,
            status: "Ongoing",
            jobId: approveJobApplication.jobId
        })
        setApproveJobApplication(null)
    }

    const handleRejection = async (data: RejectionPayload) => {
        if (!rejectJobApplication) return
        await handleApproveOrReject({
            id: rejectJobApplication.id,
            jobId: rejectJobApplication.jobId,
            status: "Rejected",
            rejectionReason: data.rejectionReason
        })
        setRejectJobApplication(null)
    }

    const totalPages = data.totalPages ?? 1
    const totalJobapplications = data.total ?? 1

    return (
        <div className="w-full flex flex-col gap-6">
            <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-sm w-fit text-text-primary hover:text-accent-hover transition-colors">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
            </button>

            {/* Filters Row */}
            <div className="flex flex-wrap items-end gap-4">

                {/* Status Filter */}
                <div className="flex flex-col gap-1">
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
                </div>

                <DateFilterPicker
                    dateFilter={dateFilter}
                    startDate={startDate}
                    endDate={endDate}
                    onDateFilterChange={(filter) => { setDateFilter(filter); setPage(1) }}
                    onStartDateChange={(date) => { setStartDate(date); setPage(1) }}
                    onEndDateChange={(date) => { setEndDate(date); setPage(1) }}
                />
            </div>

            {approvalSuccess && (
                <p className="text-success text-sm text-center">{approvalSuccess}</p>
            )}
            {approvalError && (
                <p className="text-error text-sm text-center">{approvalError}</p>
            )}

            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobApplications.map(application => (
                        <JobApplicationCard
                            application={application}
                            key={application.id}
                            onApprove={() => setApproveJobApplication({ id: application.id, jobId: application.jobId })}
                            onReject={() => setRejectJobApplication({ id: application.id, jobId: application.jobId })}
                        />
                    ))}
                </div>
            </div>

            <div className="sticky bottom-0 mt-auto pt-4 bg-bg">
                <Pagination
                    page={page}
                    totalItem={totalJobapplications}
                    whichItem="job applications"
                    totalPages={totalPages}
                    onDecrease={() => setPage(p => p - 1)}
                    onIncrease={() => setPage(p => p + 1)}
                />
            </div>

            <ConfirmModal
                isOpen={!!approveJobApplication}
                onConfirm={handleApproval}
                onClose={() => setApproveJobApplication(null)}
                isLoading={isApproving}
                text="Are you sure you want to accept this job Application?"
                heading="Confirm approval?"
                buttonLoadingText="Approving"
                buttonText="Confirm & approve"
            />

            <RejectJobApplicationModal
                isOpen={!!rejectJobApplication}
                onClose={() => setRejectJobApplication(null)}
                onConfirm={handleRejection}
            />
        </div>
    );
}