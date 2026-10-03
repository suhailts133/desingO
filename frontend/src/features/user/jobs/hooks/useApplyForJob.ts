import { useJobRequestServices } from "../jobService";

export const useApplyForAJob = () => {
  const { applyForAJob, isApplying } = useJobRequestServices();

  const handleJobApplication = async (jobId: string) => await applyForAJob(jobId);
  return {
    handleJobApplication,
    isApplying,
  };
};
