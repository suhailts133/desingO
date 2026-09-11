import type { FilterFieldConfig } from "../../../shared/filter/types";


export const VERIFICATION_FILTERS: FilterFieldConfig[] = [
    { type: "search", key: "name", placeholder: "Enter a name" },
    {
        type: "select",
        key: "status",
        options: [
            { label: "All", value: "All" },
            { label: "Approved", value: "Approved" },
            { label: "Pending", value: "Pending" },
            { label: "Rejected", value: "Rejected" },
        ],
    },
];