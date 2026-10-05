import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import JobApplicationCard from "../../jobApplications/components/JobApplicationCard";
import { useGetAllJobApplicationsQuery } from "../jobApplicationEndpoints";
import type { JobApplicationStatus, RejectionPayload } from "../jobApplicationInterFace";
import ConfirmModal from "../../../../shared/modals/ConfirmModal";
import { useApproveOrRejectJobApplication } from "../hooks/useApproveOrRejectionJobApplication";
import RejectJobApplicationModal from "../components/RejectJobApplicationModal";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "../../../../shared/common/Pagination";
import Spinner from "../../../../shared/common/Spinner";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";
import { FilterBar } from "../../../../shared/filter/FilterBar";
import { useFilterParams } from "../../../../shared/filter/useFilterParams";
import { getDateRange } from "../../../../shared/filter/dateOptions";
import type { SortByTypes } from "../../../../api/responseType";
import { JOB_APPLICATION_FILTERS } from "../jobApplicationFilters";


export default function JobApplications() {
    const { searchParams, getValue, setFilter, setPage } = useFilterParams({ sortBy: "newest" });
    const [approveJobApplication, setApproveJobApplication] = useState<{ id: string, jobId: string } | null>(null)
    const [rejectJobApplication, setRejectJobApplication] = useState<{ id: string, jobId: string } | null>(null)
    const sortBy = getValue("sortBy") as SortByTypes;
    const status = getValue("status") as JobApplicationStatus | "All";
    const page = Number(searchParams.get("page") ?? "1");
    const { startDate, endDate } = getDateRange(
        getValue("date"),
        getValue("dateFrom", ""),
        getValue("dateTo", "")
    );
    const { id } = useParams<{ id: string }>();
    const { handleApproveOrReject, isApproving } = useApproveOrRejectJobApplication()
    const { data, isLoading, error } = useGetAllJobApplicationsQuery({
        page,
        id: id as string,
        sortBy,
        startDate,
        endDate,
        status,

    }, { skip: !id })
    const handleResponse = useHandleResponse()
    const navigate = useNavigate()
    const jobApplications = data?.data

    if (isLoading) return <Spinner />
    if (error || !jobApplications) return <p className="text-error">Error loading job applications</p>

    const handleApproval = async () => {
        if (!approveJobApplication) return
        const result = await handleApproveOrReject({
            id: approveJobApplication.id,
            status: "Ongoing",
            jobId: approveJobApplication.jobId
        })
        handleResponse(result.success, "Job application approved", result.message)
        setApproveJobApplication(null)
    }

    const handleRejection = async (data: RejectionPayload) => {
        if (!rejectJobApplication) return
        const result = await handleApproveOrReject({
            id: rejectJobApplication.id,
            jobId: rejectJobApplication.jobId,
            status: "Rejected",
            rejectionReason: data.rejectionReason
        })
        handleResponse(result.success, "Job application rejected", result.message)
        setRejectJobApplication(null)
    }

    const totalPages = data.totalPages ?? 1
    const totalJobapplications = data.total ?? 1

    return (
        <div className="w-full min-h-full flex flex-col gap-6">

            <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-sm w-fit text-text-primary hover:text-accent-hover transition-colors">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
            </button>

            <FilterBar filters={JOB_APPLICATION_FILTERS} getValue={getValue} onFilterChange={setFilter} />

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

            <div className="mt-auto pt-4">
                <Pagination
                    page={page}
                    totalItem={totalJobapplications}
                    whichItem="job applications"
                    totalPages={totalPages}
                    onDecrease={() => setPage(Math.max(1, page - 1))}
                    onIncrease={() => setPage(Math.min(totalPages, page + 1))}
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
