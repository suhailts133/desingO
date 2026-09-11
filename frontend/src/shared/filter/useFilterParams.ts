import { useSearchParams } from "react-router-dom";

export function useFilterParams(defaults: Record<string, string> = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const getValue = (key: string) =>
    searchParams.get(key) ?? defaults[key] ?? "All";

  const setFilter = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(key, value);
      next.set("page", "1");
      return next;
    });
  };

  const setPage = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
  };

  return { searchParams, getValue, setFilter, setPage };
}