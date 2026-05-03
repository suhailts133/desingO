import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import JobApplicationCard from "../../jobApplications/components/JobApplicationCard";
import { useGetAllJobApplicationsQuery } from "../jobApplicationEndpoints";
import type { JobApplicationRejection, JobApplicationStatus } from "../jobApplicationInterFace";
import ConfirmModal from "../../../../shared/modals/ConfirmModal";
import { useApproveOrRejectJobApplication } from "../hooks/useApproveOrRejectionJobApplication";
import RejectJobApplicationModal from "../components/RejectJobApplicationModal";
import { useParams } from "react-router-dom";

export default function JobApplications() {
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState<JobApplicationStatus | "All">("All")
    const [approveJobApplication, setApproveJobApplication] = useState<{ id: string, jobId: string } | null>(null)
    const [rejectJobApplication, setRejectJobApplication] = useState<{ id: string, jobId: string } | null>(null)
    const { handleApproveOrReject, approvalError, approvalSuccess, isApproving } = useApproveOrRejectJobApplication()
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, error } = useGetAllJobApplicationsQuery({
        page,
        status: status === "All" ? undefined : status,
        id:id as string
    }, { skip: !id })

    const jobApplications = data?.data

    if (isLoading) return <p>Loading...</p>
    if (error || !jobApplications) return <p>Error loading job applications</p>


    const handleApproval = async () => {
        if (!approveJobApplication) return

        await handleApproveOrReject({
            id: approveJobApplication.id,
            status: "Ongoing",
            jobId: approveJobApplication.jobId
        })
        setApproveJobApplication(null)
    }


    const handleRejection = async (data: JobApplicationRejection) => {
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

            {/* Filter */}
            <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-soft-black/50 uppercase tracking-widest">Status</label>
                <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value as JobApplicationStatus | "All"); setPage(1) }}
                    className="text-xs font-semibold text-soft-black bg-off-white border border-blush-light/40 rounded-lg px-3 py-1.5 focus:outline-none"
                >
                    {["All", "Pending", "Rejected", "Ongoing"].map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>


            {approvalSuccess && (
                <p className="text-green-600 text-sm text-center">{approvalSuccess}</p>
            )}
            {approvalError && (
                <p className="text-red-500 text-sm text-center">{approvalError}</p>
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

            <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/20 bg-white/10">
                <p className="text-xs text-soft-black/50">
                    Page {page} of {totalPages} &mdash; {totalJobapplications} total job applications
                </p>
                <div className="flex items-center gap-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-Jost-Semibold
                            bg-blush-light/30 border border-white/40 text-soft-black/90
                            hover:bg-white/60 hover:text-blush-deep transition-all duration-200
                            disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={14} /> Prev
                    </button>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-Jost-Semibold
                            bg-peach/40 border border-white/40 text-soft-black/70
                            hover:bg-white/60 hover:text-blush-deep transition-all duration-200
                            disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <ConfirmModal
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
            />

        </div>
    );
}