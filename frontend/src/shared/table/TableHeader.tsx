export interface ColumnDef<T> {
  key: keyof T & string;
  label: string;
  className?: string; 
}
interface TableHeaderProps<T> {
    columns: ColumnDef<T>[];
}

export default function TableHeader<T>({ columns }: TableHeaderProps<T>) {
    return (
        <thead className="border-b-2 border-surface-border">
            <tr className="border-b border-surface-border bg-surface-hover backdrop-blur-2xl">
                {columns.map((col) => (
                    <th
                        key={col.key}
                        className="text-left px-5 py-3.5 text-xs font-Jost-Semibold text-text-faint uppercase tracking-widest"
                    >
                        {col.label}
                    </th>
                ))}
            </tr>
        </thead>
    );
}