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
        <thead className="border-b-2 border-soft-black/20">
            <tr className="border-b border-white/25 bg-white/20 backdrop-blur-2xl">
                {columns.map((col) => (
                    <th
                        key={col.key}
                        className="text-left px-5 py-3.5 text-xs font-Jost-Semibold text-soft-black/50 uppercase tracking-widest"
                    >
                        {col.label}
                    </th>
                ))}
            </tr>
        </thead>
    );
}