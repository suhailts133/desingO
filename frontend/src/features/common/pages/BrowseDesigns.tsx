import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DesignCard from "../components/cards/DesignCard";
import type { DesignFilterForm } from "../../designer/designs/designInterface";
import { useGetAllDesignsCommonQuery } from "../../designer/designs/designEndpoints";
import { SORT_OPTIONS } from "../baseData";
import Pagination from "../../../shared/common/Pagination";
import DesignFilter from "../components/filters/DesignFilter";
import DesignCardSkeleton from "../skeltons/DesignCardSkeleton";

export default function BrowseDesigns() {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [page, setPage] = useState(1);

    const { control, watch, reset } = useForm<DesignFilterForm>({
        defaultValues: {
            designStyles: null,
            propertyTypes: null,
            spaceTypes: null,
            sortBy: SORT_OPTIONS[0],
        },
    });

    const watchedFilters = watch();
    const { data, isLoading, error } = useGetAllDesignsCommonQuery({
        ...watchedFilters,
        page
    });

    useEffect(() => {
        setPage(1);
    }, [watchedFilters.designStyles, watchedFilters.propertyTypes, watchedFilters.spaceTypes, watchedFilters.sortBy]);

    const handleClearAll = () => {
        reset({ designStyles: null, propertyTypes: null, spaceTypes: null, sortBy: SORT_OPTIONS[0] });
        setPage(1);
    };

    if (error) return <div className="p-10 text-center text-red-500">Error loading designs.</div>;

    return (
        <div className="min-h-screen bg-gray-50/60 font-Jost">
            <DesignFilter
                control={control}
                onClear={handleClearAll}
                filtersVisible={filtersVisible}
                setFiltersVisible={setFiltersVisible}
            />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isLoading
                        ? Array.from({ length: 8 }).map((_, i) => (
                            <DesignCardSkeleton key={i}/>
                        ))
                        : data?.data?.map(item => (
                            <DesignCard design={item} key={item.id} />
                        ))
                    }
                </div>
            </div>

            <Pagination
                page={page}
                totalItem={data?.total ?? 0}
                whichItem="designs"
                totalPages={data?.totalPages ?? 1}
                onDecrease={() => setPage(p => p - 1)}
                onIncrease={() => setPage(p => p + 1)}
            />
        </div>
    );
}