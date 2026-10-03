import Select from "react-select";
import type { StylesConfig, SingleValue, MultiValue } from "react-select";
import { X } from "lucide-react";
import { PROPERTY_OPTIONS, STYLE_OPTIONS, SPACE_OPTIONS } from "../../../designer/designs/designData";
import { SORT_OPTIONS, type OptionType } from "../../baseData";
import { selectStyles } from "../../../../shared/filter/selectStyle";

interface Props {
    designStyles: OptionType[] | null;
    propertyTypes: OptionType[] | null;
    spaceTypes: OptionType[] | null;
    sortBy: OptionType;
    onFilterChange: (key: string, value: string | string[] | null) => void;
    onClear: () => void;
}

export default function DesignFilters({ designStyles, propertyTypes, spaceTypes, sortBy, onFilterChange, onClear }: Props) {
    const handleMultiSelectChange = (key: "designStyles" | "propertyTypes" | "spaceTypes", selected: MultiValue<OptionType>) => {
        const labels = selected.map((opt) => opt.label);

        onFilterChange(key, labels.length ? labels : null);
    };

    const handleSortChange = (selected: SingleValue<OptionType>) => {
        onFilterChange("sortBy", selected?.value ?? SORT_OPTIONS[0].value);
    };

    return (
        <div className="bg-surface border-b border-surface-border px-6 py-5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-wrap items-center gap-3">
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
                                value={spaceTypes}
                                onChange={(val) => handleMultiSelectChange("spaceTypes", val)}
                                isMulti
                                options={SPACE_OPTIONS}
                                placeholder="Space Type"
                                isClearable
                                styles={selectStyles as StylesConfig<OptionType, true>}
                            />
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        <button
                            onClick={onClear}
                            className="text-sm text-text-faint hover:text-error flex items-center gap-1 cursor-pointer"
                        >
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
