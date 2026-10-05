import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SelectFilter } from "./SelectFilter";
import { DATE_FILTER_OPTIONS } from "./dateOptions";
import type { FilterOption } from "./types";

type Props = {
  filterKey: string;
  label: string;
  options?: FilterOption[];
  getValue: (key: string, fallback?: string) => string;
  onChange: (key: string, value: string) => void;
  widthClass?: string;
};

export function DateFilter({
  filterKey,
  label,
  options = DATE_FILTER_OPTIONS,
  getValue,
  onChange,
  widthClass = "w-40",
}: Props) {
  const fromKey = `${filterKey}From`;
  const toKey = `${filterKey}To`;

  const preset = getValue(filterKey);
  const from = getValue(fromKey, "");
  const to = getValue(toKey, "");

  // empty URL value -> today, like your old state defaults
  const fromDate = from ? new Date(from) : new Date();
  const toDate = to ? new Date(to) : new Date();

  return (
    <>
      <div className="flex flex-col gap-1">
        <label htmlFor={`filter-${filterKey}`} className="text-xs text-text-primary/70 pl-1">
          {label}
        </label>
        <SelectFilter
          id={`filter-${filterKey}`}
          value={preset}
          onChange={(v) => onChange(filterKey, v)}
          options={options}
          widthClass={widthClass}
        />
      </div>

      {preset === "custom" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-primary/70 pl-1">From</label>
            <DatePicker
              selected={fromDate}
              onChange={(d: Date | null) => d && onChange(fromKey, d.toISOString())}
              selectsStart
              startDate={fromDate}
              endDate={toDate}
              maxDate={new Date()}
              dateFormat="dd MMM yyyy"
              className="auth-input w-36"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-primary/70 pl-1">To</label>
            <DatePicker
              selected={toDate}
              onChange={(d: Date | null) => d && onChange(toKey, d.toISOString())}
              selectsEnd
              startDate={fromDate}
              endDate={toDate}
              minDate={fromDate}
              maxDate={new Date()}
              dateFormat="dd MMM yyyy"
              className="auth-input w-36"
            />
          </div>
        </>
      )}
    </>
  );
}