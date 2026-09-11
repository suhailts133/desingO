import type { FilterFieldConfig } from "../../../shared/filter/types";

export const USER_FILTERS: FilterFieldConfig[] = [
  { type: "search", key: "name", placeholder: "Enter a name" },
  {
    type: "select",
    key: "role",
    options: [
      { label: "All", value: "All" },
      { label: "Customer", value: "Customer" },
      { label: "Designer", value: "Designer" },
    ],
  },
  {
    type: "select",
    key: "status",
    options: [
      { label: "All", value: "All" },
      { label: "Active", value: "Active" },
      { label: "Blocked", value: "Blocked" },
    ],
  },
];