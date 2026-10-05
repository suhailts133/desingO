import { ChevronLeft, } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css";
import { useHireRequestQuery } from "../designEndpoints";
import HireRequestCard from "../components/HireRequestCard";
import Pagination from "../../../../shared/common/Pagination";
import type { RejectionPayload } from "../../../user/jobApplications/jobApplicationInterFace";
import ConfirmModal from "../../../../shared/modals/ConfirmModal";
import RejectJobApplicationModal from "../../../user/jobApplications/components/RejectJobApplicationModal";
import { useApproveOrRejectHireRequest } from "../hooks/useApproveOrRejectHireRequest";
import { useHandleResponse } from "../../../../helpers/useHandleResponse";
import Spinner from "../../../../shared/common/Spinner";
import { useFilterParams } from "../../../../shared/filter/useFilterParams";
import type { SortByTypes } from "../../../../api/responseType";
import type { JobStatus } from "../../../user/jobs/jobInterface";
import { getDateRange } from "../../../../shared/filter/dateOptions";
import { JOB_FILTERS } from "../../../user/jobs/jobFilter";
import { FilterBar } from "../../../../shared/filter/FilterBar";


export default function HireRequestsPage() {
    const { searchParams, getValue, setFilter, setPage } = useFilterParams({ sortBy: "newest" });
    const projectTitle = searchParams.get("projectTitle");
    const sortBy = getValue("sortBy") as SortByTypes;
    const status = getValue("status") as JobStatus | "All";
    const page = Number(searchParams.get("page") ?? "1");
    const { startDate, endDate } = getDateRange(
        getValue("date"),
        getValue("dateFrom", ""),
        getValue("dateTo", "")
    );

    const [approveHireRequest, setApproveHireRequest] = useState<{ hireRequestId: string } | null>(null)
    const [rejectHireRequest, setRejectHireRequest] = useState<{ hireRequestId: string } | null>(null)
    const { handleSubmission, isApproveOrReject } = useApproveOrRejectHireRequest()
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, error } = useHireRequestQuery({
        page,
        sortBy,
        status,
        startDate,
        endDate,
        projectTitle: projectTitle || undefined,
        designId: id as string,
    }, { skip: !id })

    const navigate = useNavigate()
    const handleResponse = useHandleResponse()
    const hireRequests = data?.data

    if (isLoading) return <Spinner />
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
        <div className="w-full min-h-full flex flex-col gap-6">

            <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-sm w-fit text-accent hover:text-accent-hover transition-colors">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
            </button>

            <FilterBar filters={JOB_FILTERS} getValue={getValue} onFilterChange={setFilter} />


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

            <div className="mt-auto pt-4">
                <Pagination
                    page={page}
                    totalItem={totalHireRequests}
                    whichItem="Hire Requests"
                    totalPages={totalPages}
                    onDecrease={() => setPage(Math.max(1, page - 1))}
                    onIncrease={() => setPage(Math.min(totalPages, page + 1))}
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

