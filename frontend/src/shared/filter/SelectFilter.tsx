import type { FilterOption } from "./types";

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  widthClass?: string;
};

export function SelectFilter({ value, onChange, options, widthClass = "w-30" }: Props) {
  return (
    <div className={widthClass}>
      <select className="auth-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}