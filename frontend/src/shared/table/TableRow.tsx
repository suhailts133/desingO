import type { ReactNode } from "react";
import type { ColumnDef } from "./TableHeader";

interface TableRowProps<T> {
  row: T;
  columns: ColumnDef<T>[];
  cellRenderers: Partial<Record<keyof T & string, (row: T) => ReactNode>>;
  isLast: boolean;
  isEven: boolean;
}

const DEFAULT_CELL_CLASS = "text-soft-black text-sm";

export default function TableRow<T>({ row, columns, cellRenderers, isLast, isEven }: TableRowProps<T>) {
  return (
    <tr
      className={`${isEven ? "bg-white/50" : ""} transition-colors duration-150 hover:bg-white/20 ${
        isLast ? "" : "border-b border-white/20"
      }`}
    >
      {columns.map((col) => {
        const renderer = cellRenderers[col.key];
        return (
          <td key={col.key} className="px-5 py-3.5">
            {renderer ? (
              renderer(row)
            ) : (
              <span className={col.className ?? DEFAULT_CELL_CLASS}>{String(row[col.key] ?? "")}</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}