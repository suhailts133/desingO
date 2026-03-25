import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import DesignCard from "../components/DesignCard";
import { PROPERTY_OPTIONS, STYLE_OPTIONS, SPACE_OPTIONS } from "../../designer/designs/designData";
import type { DesignFilterForm } from "../../designer/designs/designInterface";
import { useGetAllDesignsCommonQuery } from "../../designer/designs/designEndpoints";
import { SORT_OPTIONS } from "../baseData";





export default function BrowseDesigns() {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [page, setPage] = useState(1);

    const { control, watch, reset } = useForm<DesignFilterForm>({
        defaultValues: {
            designStyles: null,
            propertyTypes: null,
            sortBy: SORT_OPTIONS[0],
        },
    });

    const watchedFilters = watch();

    console.log(watchedFilters)
    const { data, isLoading, error } = useGetAllDesignsCommonQuery({
        ...watchedFilters,
        page
    });

    useEffect(() => {
        setPage(1);
    }, [watchedFilters.designStyles, watchedFilters.propertyTypes, watchedFilters.spaceTypes, watchedFilters.sortBy]);

    const designs = data?.data



    const handleClearAll = () => {
        reset({ designStyles: null, propertyTypes: null, spaceTypes: null, sortBy: SORT_OPTIONS[0] });
        setPage(1);
    };

    if (isLoading) {
        return <div className="p-10 text-center animate-pulse text-gray-400 font-Jost">Loading Designs...</div>;
    }

    if (error || !designs) {
        return <div className="p-10 text-center text-red-500 font-Jost-Semibold">Error loading designs.</div>;
    }

    const totalDesigns = data.total ?? 0
    const totalPages = data.totalPages ?? 1

    return (
        <div className="min-h-screen bg-gray-50/60 font-Jost">

            <div className="bg-white border-b border-gray-100 px-6 py-5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-1 mb-6">
                        <h1 className="font-semibold text-2xl text-gray-900">Browse Designs</h1>
                    </div>

                    {/* Filter  */}
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => setFiltersVisible(!filtersVisible)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all
                                ${filtersVisible
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
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
                                        <Select {...field} isMulti options={SPACE_OPTIONS} placeholder="space Type" isClearable />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="ml-auto flex items-center gap-4">

                            <button onClick={handleClearAll} className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1">
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


            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {designs.map(data => (
                        <DesignCard design={data} key={data.id} />
                    ))}
                </div>
            </div>

            {/* ── Pagination ── */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/20 bg-white/10">
                    <p className="text-xs text-soft-black/50">
                        Page {page} of {totalPages} &mdash; {totalDesigns} total designs
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-Jost-Semibold
                bg-blush-light/30 border border-white/40 text-soft-black/90
                hover:bg-white/60 hover:text-blush-deep transition-all duration-200
                disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={14} /> Prev
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-Jost-Semibold
                bg-peach/40 border border-white/40 text-soft-black/70
                hover:bg-white/60 hover:text-blush-deep transition-all duration-200
                disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}