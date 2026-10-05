import type { FilterFieldConfig } from "../../../shared/filter/types";


export const VERIFICATION_FILTERS: FilterFieldConfig[] = [
    { type: "search", key: "name", label:"name", placeholder: "Enter a name" },
    {
        type: "select",
        key: "status",
        label:"status",
        options: [
            { label: "All", value: "All" },
            { label: "Approved", value: "Approved" },
            { label: "Pending", value: "Pending" },
            { label: "Rejected", value: "Rejected" },
        ],
    },
];