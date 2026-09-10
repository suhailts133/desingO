import type { ReactNode } from "react";
import type { ColumnDef } from "./TableHeader";
import TableRow from "./TableRow";

interface TableBodyProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    cellRenderers: Partial<Record<string, (row: T) => ReactNode>>;
    keyExtractor: (row: T) => string;
}

export default function TableBody<T>({ data, columns, cellRenderers, keyExtractor }: TableBodyProps<T>) {
    return (
        <tbody>
            {data.map((row, i) => (
                <TableRow
                    key={keyExtractor(row)}
                    row={row}
                    columns={columns}
                    cellRenderers={cellRenderers}
                    isLast={i === data.length - 1}
                    isEven={i % 2 === 0}
                />
            ))}
        </tbody>
    );
}