export type FilterOption = { label: string; value: string };

export type FilterFieldConfig =
  | {
      type: "search";
      key: string;
      label: string;
      placeholder?: string;
      debounceMs?: number;
      widthClass?: string;
    }
  | {
      type: "select";
      key: string;
      label: string;
      options: FilterOption[];
      widthClass?: string;
    };