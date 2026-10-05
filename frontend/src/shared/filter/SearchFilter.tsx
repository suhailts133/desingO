import { useEffect, useState } from "react";
import { Search } from "lucide-react";

type Props = {
  id?: string
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  widthClass?: string;
};

export function SearchFilter({
  value,
  id,
  onChange,
  placeholder = "Enter a name",
  debounceMs = 400,
  widthClass = "w-70",
}: Props) {
  const [input, setInput] = useState(value);

  useEffect(() => setInput(value), [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input !== value) onChange(input);
    }, debounceMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <div className={`relative ${widthClass}`}>
      <input
        id={id}
        type="text"
        className="auth-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
      />
      <span className="absolute right-3 inset-y-0 flex items-center text-text-faint pointer-events-none">
        <Search size={18} />
      </span>
    </div>
  );
}