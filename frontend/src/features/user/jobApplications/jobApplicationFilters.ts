import type { FilterFieldConfig } from "../../../shared/filter/types";

export const JOB_APPLICATION_FILTERS: FilterFieldConfig[] = [
  {
    type: "select",
    key: "status",
    label: "Status",
    options: [
      { label: "All", value: "All" },
      { label: "Pending", value: "Pending" },
      { label: "Completed", value: "Completed" },
      { label: "Rejected", value: "Rejected" },
      { label: "Ongoing", value: "Ongoing" },
    ],
  },
 
 
  {
    type: "select",
    key: "sortBy",
    label: "Sort By",
    options: [
      { label: "Latest", value: "newest" },
      { label: "Oldest", value: "oldest" },
    ],
  },
   { type: "date", key: "date", label: "Date" },
];
