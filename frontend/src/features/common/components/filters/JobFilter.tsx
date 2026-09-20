import Select, { type MultiValue, type SingleValue, type StylesConfig } from "react-select";
import { SlidersHorizontal, X } from "lucide-react";
import { PROPERTY_OPTIONS, STYLE_OPTIONS } from "../../../designer/designs/designData";
import { TIMELINE_OPTIONS } from "../../../user/jobs/jobData";
import { SORT_OPTIONS, type OptionType } from "../../baseData";
import JobLocationFilter from "./JobLocationFilter";
import { selectStyles } from "../../../../shared/filter/selectStyle";

type Props = {
    designStyles: OptionType[] | null;
    propertyTypes: OptionType[] | null;
    timeLines: OptionType[] | null;
    sortBy: OptionType;
    onFilterChange: (key: string, value: string | string[] | null) => void;
    onClear: () => void;
    filtersVisible: boolean;
    setFiltersVisible: (visible: boolean) => void;
    hasLocation: boolean;
    radiusValue: OptionType;
    isLocating: boolean;
    locationError: string | null;
    onUseMyLocation: () => void;
    onRadiusChange: (selected: SingleValue<OptionType>) => void;
}

export default function JobFilter({
    designStyles, propertyTypes, timeLines, sortBy, onFilterChange, onClear, filtersVisible, setFiltersVisible,
    hasLocation, radiusValue, isLocating, locationError, onUseMyLocation, onRadiusChange,
}: Props) {

    const handleMultiSelectChange = (key: "designStyles" | "propertyTypes" | "timeLines", selected: MultiValue<OptionType>) => {
        const labels = selected.map((opt) => opt.label);
        onFilterChange(key, labels.length ? labels : null);
    };
    const handleSortChange = (selected: SingleValue<OptionType>) => {
        onFilterChange("sortBy", selected?.value ?? SORT_OPTIONS[0].value);
    };
    return (
        <div className="bg-surface border-b border-surface-border px-6 py-5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-1 mb-6">
                    <h1 className="font-semibold text-2xl text-text-primary">Browse Jobs</h1>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={() => setFiltersVisible(!filtersVisible)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all
                            ${filtersVisible ? "bg-accent text-text-on-accent border-accent" : "bg-surface text-text-muted border-surface-border hover:border-surface-border-strong"}`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>

                    <JobLocationFilter
                        hasLocation={hasLocation}
                        radiusValue={radiusValue}
                        isLocating={isLocating}
                        error={locationError}
                        onUseMyLocation={onUseMyLocation}
                        onRadiusChange={onRadiusChange}
                    />

                    <div className={`flex flex-wrap items-center gap-3 ${filtersVisible ? "opacity-100" : "hidden"}`}>
                        <div className="min-w-50">
                            <Select
                                value={designStyles}
                                onChange={(val) => handleMultiSelectChange("designStyles", val)}
                                isMulti
                                options={STYLE_OPTIONS}
                                placeholder="Design Style"
                                isClearable
                                styles={selectStyles as StylesConfig<OptionType, true>}
                            />
                        </div>
                        <div className="min-w-50">
                            <Select
                                value={propertyTypes}
                                onChange={(val) => handleMultiSelectChange("propertyTypes", val)}
                                isMulti
                                options={PROPERTY_OPTIONS}
                                placeholder="Property Type"
                                isClearable
                                styles={selectStyles as StylesConfig<OptionType, true>}
                            />
                        </div>
                        <div className="min-w-50">
                            <Select
                                value={timeLines}
                                onChange={val => handleMultiSelectChange("timeLines", val)}
                                isMulti
                                options={TIMELINE_OPTIONS}
                                placeholder="Time Line"
                                isClearable
                                styles={selectStyles as StylesConfig<OptionType, true>}
                            />
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        <button onClick={onClear} className="text-sm text-text-faint hover:text-error flex items-center gap-1">
                            <X className="w-4 h-4" /> Clear
                        </button>

                        <div className="min-w-45">
                            <Select
                                value={sortBy}
                                onChange={handleSortChange}
                                options={SORT_OPTIONS}
                                isSearchable={false}
                                styles={selectStyles as StylesConfig<OptionType, false>}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}