import type { FilterOption } from "./types";

export const DATE_FILTER_OPTIONS: FilterOption[] = [
  { label: "All time", value: "All" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Custom", value: "custom" },
];

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const endOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};
const daysAgo = (n: number) => {
  const x = new Date();
  x.setDate(x.getDate() - n);
  return x;
};

export const getDateRange = (preset: string, from?: string, to?: string) => {
  const now = new Date();
  let start: Date | undefined;
  let end: Date | undefined;

  switch (preset) {
    case "today":
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case "yesterday":
      start = startOfDay(daysAgo(1));
      end = endOfDay(daysAgo(1));
      break;
    case "7d":
      start = startOfDay(daysAgo(6));
      end = endOfDay(now);
      break;
    case "30d":
      start = startOfDay(daysAgo(29));
      end = endOfDay(now);
      break;
    case "custom":
      start = startOfDay(from ? new Date(from) : now);
      end = endOfDay(to ? new Date(to) : now);
      break;
  }

  return { startDate: start?.toISOString(), endDate: end?.toISOString() };
};
