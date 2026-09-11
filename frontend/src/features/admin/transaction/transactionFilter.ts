import type { FilterFieldConfig } from "../../../shared/filter/types";


export const TRANSACTION_FILTERS: FilterFieldConfig[] = [
  {
    type: "select",
    key: "type",
    widthClass: "w-45",
    options: [
      { label: "All types", value: "All" },
      { label: "Payment", value: "Payment" },
      { label: "Commission", value: "Commission" },
      { label: "Payout", value: "Payout" },
      { label: "Refund", value: "Refund" },
    ],
  },
];