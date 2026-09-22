import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DateFilter } from "../../features/user/jobApplications/jobApplicationInterFace";

interface DateFilterPickerProps {
    dateFilter: DateFilter;
    startDate: Date;
    endDate: Date;
    onDateFilterChange: (filter: DateFilter) => void;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
}

export default function DateFilterPicker({
    dateFilter,
    startDate,
    endDate,
    onDateFilterChange,
    onStartDateChange,
    onEndDateChange,
}: DateFilterPickerProps) {
    const today = new Date();

    const handleStartDate = (date: Date | null) => {
        if (!date) return;
        onStartDateChange(date);
        if (endDate < date) onEndDateChange(date);
    };

    const handleEndDate = (date: Date | null) => {
        if (!date) return;
        onEndDateChange(date);
    };

    return (
        <div className="flex flex-wrap items-end gap-4">
            {/* Dropdown */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-faint uppercase tracking-widest">
                    Date
                </label>
                <select
                    value={dateFilter}
                    onChange={(e) => onDateFilterChange(e.target.value as DateFilter)}
                    className="text-xs font-semibold text-text-primary bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors cursor-pointer"
                >
                    {(["Latest", "Oldest", "Today", "Custom"] as DateFilter[]).map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            {/* Custom date range */}
            {dateFilter === "Custom" && (
                <div className="flex items-end gap-3 px-4 py-2.5 bg-surface border border-surface-border rounded-xl">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-text-faint uppercase tracking-widest">
                            From
                        </label>
                        <DatePicker
                            selected={startDate}
                            onChange={handleStartDate}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            maxDate={today}
                            className="text-xs font-semibold text-text-primary bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5 placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent outline-none w-32 transition-colors cursor-pointer"
                            dateFormat="dd MMM yyyy"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-text-faint uppercase tracking-widest">
                            To
                        </label>
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDate}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            maxDate={today}
                            className="text-xs font-semibold text-text-primary bg-surface-hover border border-surface-border rounded-lg px-3 py-1.5 placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent outline-none w-32 transition-colors cursor-pointer"
                            dateFormat="dd MMM yyyy"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}