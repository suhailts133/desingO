import { SearchFilter } from "./SearchFilter";
import { SelectFilter } from "./SelectFilter";
import type { FilterFieldConfig } from "./types";

type Props = {
  filters: FilterFieldConfig[];
  getValue: (key: string) => string;
  onFilterChange: (key: string, value: string) => void;
};

export function FilterBar({ filters, getValue, onFilterChange }: Props) {
  return (
    <div className="rounded-2xl flex items-center justify-center gap-3 mb-5 bg-surface p-5 border border-surface-border-strong">
      {filters.map((f) =>
        f.type === "search" ? (
          <SearchFilter
            key={f.key}
            value={getValue(f.key)}
            onChange={(v) => onFilterChange(f.key, v)}
            placeholder={f.placeholder}
            debounceMs={f.debounceMs}
            widthClass={f.widthClass}
          />
        ) : (
          <SelectFilter
            key={f.key}
            value={getValue(f.key)}
            onChange={(v) => onFilterChange(f.key, v)}
            options={f.options}
            widthClass={f.widthClass}
          />
        )
      )}
    </div>
  );
}