import type { FilterFieldConfig } from "../../../shared/filter/types";

export const ACTIVE_JOBS_FILTERS: FilterFieldConfig[] = [
  { type: "search", key: "sourceName", label: "Project Title", placeholder: "Enter project title" },
  {
    type: "select",
    key: "status",
    label: "Status",
    options: [
      { label: "All", value: "All" },
      { label: "Active", value: "Active" },
      { label: "Completed", value: "Completed" },
      { label: "Cancelled", value: "Cancelled" },
      { label: "Terminated", value: "Terminated" },
    ],
  },
  {
    type: "select",
    key: "sourceType",
    label: "Job Type",
    options: [
      { label: "All", value: "All" },
      { label: "Job Request", value: "jobRequest" },
      { label: "Direct Hire", value: "direct_hire" },
    ],
  },
  {
    type: "select",
    key: "proposalStatus",
    label: "Proposal Status",
    options: [
      { label: "All", value: "All" },
      { label: "Not Created", value: "NOT_CREATED" },
      { label: "Created", value: "CREATED" },
      { label: "Rejected", value: "REJECTED" },

    ],
  },
  {
    type: "select",
    key: "sortBy",
    label: "Sort By",
    options: [
      { label: "Latest", value: "newest" },
      { label: "Oldest", value: "oldest" },
      { label: "Name A-Z", value: "name_asc" },
      { label: "Name Z-A", value: "name_desc" },
    ],
  },
   { type: "date", key: "date", label: "Date" },
];

