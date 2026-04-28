import { Controller, type Control } from "react-hook-form";
import Select from "react-select";
import { SlidersHorizontal, X } from "lucide-react";
import { PROPERTY_OPTIONS, STYLE_OPTIONS, SPACE_OPTIONS } from "../../../designer/designs/designData";
import { SORT_OPTIONS } from "../../baseData";
import type { DesignFilterForm } from "../../../designer/designs/designInterface";

interface Props {
    control: Control<DesignFilterForm>;
    onClear: () => void;
    filtersVisible: boolean;
    setFiltersVisible: (visible: boolean) => void;
}

export default function DesignFilters({ control, onClear, filtersVisible, setFiltersVisible }: Props) {
    return (
        <div className="bg-white border-b border-gray-100 px-6 py-5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-1 mb-6">
                    <h1 className="font-semibold text-2xl text-gray-900">Browse Designs</h1>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={() => setFiltersVisible(!filtersVisible)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all
                            ${filtersVisible ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>

                    <div className={`flex flex-wrap items-center gap-3 ${filtersVisible ? "opacity-100" : "hidden"}`}>
                        <div className="min-w-50">
                            <Controller
                                name="designStyles"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} isMulti options={STYLE_OPTIONS} placeholder="Design Style" isClearable />
                                )}
                            />
                        </div>
                        <div className="min-w-50">
                            <Controller
                                name="propertyTypes"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} isMulti options={PROPERTY_OPTIONS} placeholder="Property Type" isClearable />
                                )}
                            />
                        </div>
                        <div className="min-w-50">
                            <Controller
                                name="spaceTypes"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} isMulti options={SPACE_OPTIONS} placeholder="Space Type" isClearable />
                                )}
                            />
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        <button onClick={onClear} className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1">
                            <X className="w-4 h-4" /> Clear
                        </button>

                        <div className="min-w-45">
                            <Controller
                                name="sortBy"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} options={SORT_OPTIONS} isSearchable={false} />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}