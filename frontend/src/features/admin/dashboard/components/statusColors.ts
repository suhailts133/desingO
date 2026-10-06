import type { DisputeStatus } from "../../../proposal/proposalInterface";
import type { JobStatus } from "../../../user/jobs/jobInterface";

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  Pending: "var(--color-warning)",
  Ongoing: "var(--color-accent)",
  Closed: "var(--color-text-muted)",
  Terminated: "var(--color-error)",
  Rejected: "var(--color-text-faint)",
  Accepted: "var(--color-accent-hover)",
};

export const DISPUTE_STATUS_COLORS: Record<DisputeStatus, string> = {
  Open: "var(--color-warning)",
  "Under Review": "var(--color-accent-tint-text)",
  Resolved: "var(--color-accent)",
  Redo: "var(--color-error-text)",
  "Awaiting Confirmation": "var(--color-text-muted)",
  Terminated: "var(--color-error)",
};