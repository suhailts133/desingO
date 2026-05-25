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
                <label className="text-xs font-semibold text-soft-black/50 uppercase tracking-widest">
                    Date
                </label>
                <select
                    value={dateFilter}
                    onChange={(e) => onDateFilterChange(e.target.value as DateFilter)}
                    className="text-xs font-semibold text-soft-black bg-off-white border border-blush-light/40 rounded-lg px-3 py-1.5 focus:outline-none"
                >
                    {(["Latest", "Oldest", "Today", "Custom"] as DateFilter[]).map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            {/* Custom date range */}
            {dateFilter === "Custom" && (
                <div className="flex items-end gap-3 px-4 py-2.5 bg-off-white border border-blush-light/40 rounded-xl">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-soft-black/50 uppercase tracking-widest">
                            From
                        </label>
                        <DatePicker
                            selected={startDate}
                            onChange={handleStartDate}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            maxDate={today}
                            className="text-xs font-semibold text-soft-black bg-transparent border border-blush-light/40 rounded-lg px-3 py-1.5 focus:outline-none w-32 cursor-pointer"
                            dateFormat="dd MMM yyyy"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-soft-black/50 uppercase tracking-widest">
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
                            className="text-xs font-semibold text-soft-black bg-transparent border border-blush-light/40 rounded-lg px-3 py-1.5 focus:outline-none w-32 cursor-pointer"
                            dateFormat="dd MMM yyyy"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}