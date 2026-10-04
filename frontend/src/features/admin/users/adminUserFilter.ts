import type { FilterFieldConfig } from "../../../shared/filter/types";

export const USER_FILTERS: FilterFieldConfig[] = [
  { type: "search", key: "name", label: "Name", placeholder: "Enter a name" },
  {
    type: "select",
    key: "role",
    label: "Role",
    options: [
      { label: "All", value: "All" },
      { label: "Customer", value: "Customer" },
      { label: "Designer", value: "Designer" },
    ],
  },
  {
    type: "select",
    key: "status",
    label: "Status",
    options: [
      { label: "All", value: "All" },
      { label: "Active", value: "Active" },
      { label: "Blocked", value: "Blocked" },
    ],
  }, 
];