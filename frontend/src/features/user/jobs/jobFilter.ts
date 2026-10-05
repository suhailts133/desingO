import type { FilterFieldConfig } from "../../../shared/filter/types";

export const JOB_FILTERS: FilterFieldConfig[] = [
  { type: "search", key: "projectTitle", label: "Project Title", placeholder: "Enter project title" },
  {
    type: "select",
    key: "status",
    label: "Status",
    options: [
      { label: "All", value: "All" },
      { label: "Pending", value: "Pending" },
      { label: "Ongoing", value: "Ongoing" },
      { label: "Accepted", value: "Accepted" },
      { label: "Closed", value: "Closed" },
      { label: "Rejected", value: "Rejected" },
      { label: "Terminated", value: "Terminated" },
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

