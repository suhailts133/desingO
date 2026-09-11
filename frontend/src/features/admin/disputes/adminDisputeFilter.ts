import type { FilterFieldConfig } from "../../../shared/filter/types";

export const DISPUTE_FILTERS: FilterFieldConfig[] = [
    {
        type: "select",
        key: "status",
        widthClass: "w-45",
        options: [
            { label: "All statuses", value: "All" },
            { label: "Open", value: "Open" },
            { label: "Under Review", value: "Under Review" },
            { label: "Redo", value: "Redo" },
            { label: "Awaiting Confirmation", value: "Awaiting Confirmation" },
            { label: "Resolved", value: "Resolved" },
        ],
    },
    {
        type: "select",
        key: "sort",
        options: [
            { label: "Newest", value: "desc" },
            { label: "Oldest", value: "asc" },
        ],
    },
];