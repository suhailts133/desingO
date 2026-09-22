import type { ReactNode } from "react";
import type { ColumnDef } from "./TableHeader";

interface TableRowProps<T> {
  row: T;
  columns: ColumnDef<T>[];
  cellRenderers: Partial<Record<keyof T & string, (row: T) => ReactNode>>;
  isLast: boolean;
  isEven: boolean;
}

const DEFAULT_CELL_CLASS = "text-text-primary text-sm";

export default function TableRow<T>({ row, columns, cellRenderers }: TableRowProps<T>) {
  return (
    <tr
      className="bg-bg-raised transition-colors duration-150 hover:bg-surface-hover"
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