import { SearchFilter } from "./SearchFilter";
import { SelectFilter } from "./SelectFilter";
import type { FilterFieldConfig } from "./types";

type Props = {
  filters: FilterFieldConfig[];
  getValue: (key: string, fallback?:string) => string;
  onFilterChange: (key: string, value: string) => void;
};

export function FilterBar({ filters, getValue, onFilterChange }: Props) {
  return (
    <div className="rounded-2xl flex items-end justify-center gap-3 mb-5 bg-surface p-5 border border-surface-border-strong">
      {filters.map((f) => (
        <div key={f.key} className="flex flex-col gap-1">
          <label
            htmlFor={`filter-${f.key}`}
            className="text-xs text-text-primary/70 pl-1"
          >
            {f.label}
          </label>

          {f.type === "search" ? (
            <SearchFilter
              id={`filter-${f.key}`}
              value={getValue(f.key, "")}
              onChange={(v) => onFilterChange(f.key, v)}
              placeholder={f.placeholder}
              debounceMs={f.debounceMs}
              widthClass={f.widthClass}
            />
          ) : (
            <SelectFilter
              id={`filter-${f.key}`}
              value={getValue(f.key)}
              onChange={(v) => onFilterChange(f.key, v)}
              options={f.options}
              widthClass={f.widthClass}
            />
          )}
        </div>
      ))}
    </div>
  );
}