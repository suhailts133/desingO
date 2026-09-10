
import type { TransactionType } from "../../transaction/transactionInterface";
import type { ReportGroupBy, ReportQueryParams } from "../adminDashboardInterface";


const GROUP_BY_OPTIONS: ReportGroupBy[] = ["day", "week", "month", "year", "custom"];
const TYPE_OPTIONS: TransactionType[] = ["All", "Payment", "Commission", "Payout", "Refund"];

interface TransactionReportFilterProps {
    value: ReportQueryParams;
    onChange: (value: ReportQueryParams) => void;
}

export default function TransactionReportFilter({ value, onChange }: TransactionReportFilterProps) {
    const isCustom = value.groupBy === "custom";

    const handleGroupByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const groupBy = e.target.value as ReportGroupBy;
        onChange({
            ...value,
            groupBy,
            from: groupBy === "custom" ? value.from : undefined,
            to: groupBy === "custom" ? value.to : undefined,
        });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value as TransactionType;
        onChange({ ...value, type: type === "All" ? undefined : type });
    };

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...value, from: e.target.value });
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...value, to: e.target.value });
    };

    return (
        <div className="rounded-2xl flex items-center justify-center gap-3 mb-5 bg-white/50 p-5">
            <div className="w-40">
                <select className="auth-input" value={value.groupBy} onChange={handleGroupByChange}>
                    {GROUP_BY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="w-40">
                <select className="auth-input" value={value.type ?? "All"} onChange={handleTypeChange}>
                    {TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {isCustom && (
                <>
                    <div className="w-40">
                        <input
                            type="date"
                            className="auth-input"
                            value={value.from ?? ""}
                            onChange={handleFromChange}
                        />
                    </div>

                    <div className="w-40">
                        <input
                            type="date"
                            className="auth-input"
                            value={value.to ?? ""}
                            onChange={handleToChange}
                        />
                    </div>
                </>
            )}
        </div>
    );
}