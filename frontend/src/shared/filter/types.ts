export type FilterOption = { label: string; value: string };

export type FilterFieldConfig =
  | {
      type: "search";
      key: string;
      placeholder?: string;
      debounceMs?: number;
      widthClass?: string; // default w-70
    }
  | {
      type: "select";
      key: string;
      options: FilterOption[];
      widthClass?: string; // default w-30
    };