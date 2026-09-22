import { useState } from "react";
import { useGetMyJobApplicationsQuery } from "../myJobApplicationEndpoints";
import type { JobApplicationStatus } from "../myJobApplicationInterFace";
import MyJobApplicationCard from "../components/MyJobApplicationCard";
import ConfirmModal from "../../../../shared/modals/ConfirmModal";
import { useDeleteMyJobApplication } from "../hooks/useDeleteMyJobApplication";
import Pagination from "../../../../shared/common/Pagination";

export default function MyJobApplications() {
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState<JobApplicationStatus | "All">("All")
    const [deleteJobApplication, setDeleteJobApplication] = useState<string | null>(null)
    const { handleDeletion, deleteError, deleteSuccess, isDeleting } = useDeleteMyJobApplication();
    const { data, isLoading, error } = useGetMyJobApplicationsQuery({
        page,
        status: status === "All" ? undefined : status
    })

    const jobApplications = data?.data

    if (isLoading) return <p className="text-text-faint p-6 text-center">Loading...</p>
    if (error || !jobApplications) return <p className="text-error p-6 text-center">Error loading job applications</p>

    const handleDelete = async () => {
        if (!deleteJobApplication) return

        console.log(deleteJobApplication)
        await handleDeletion(deleteJobApplication)
        setDeleteJobApplication(null)
    }

    const totalPages = data.totalPages ?? 1
    const totalJobapplications = data.total ?? 1

    return (
        <div className="w-full flex flex-col gap-6 min-h-full">

            {/* Filter */}
            <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-text-faint uppercase tracking-widest">Status</label>
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

            {deleteSuccess && (
                <p className="text-success text-sm text-center">{deleteSuccess}</p>
            )}
            {deleteError && (
                <p className="text-error text-sm text-center">{deleteError}</p>
            )}

            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobApplications.map(application => (
                        <MyJobApplicationCard
                            application={application}
                            key={application.id}
                            onDelete={() => setDeleteJobApplication(application.id)}
                        />
                    ))}
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteJobApplication}
                onConfirm={handleDelete}
                onClose={() => setDeleteJobApplication(null)}
                isLoading={isDeleting}
                text="Are you sure you want to delete this job Application?"
                heading="Confirm Deletion?"
                buttonLoadingText="Deleting"
                buttonText="Confirm & delete"
            />
            
            <div className="sticky bottom-0 mt-auto py-4 bg-bg z-10 border-t border-surface-border">
                <Pagination
                    page={page}
                    totalItem={totalJobapplications}
                    totalPages={totalPages}
                    whichItem="job applications"
                    onDecrease={() => setPage(p => p - 1)}
                    onIncrease={() => setPage(p => p + 1)}
                />
            </div>

        </div>
    );
}