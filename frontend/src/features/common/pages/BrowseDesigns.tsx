import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DesignCard from "../components/cards/DesignCard";
import { useGetAllDesignsCommonQuery } from "../../designer/designs/designEndpoints";
import { SORT_OPTIONS } from "../baseData";
import Pagination from "../../../shared/common/Pagination";
import DesignFilter from "../components/filters/DesignFilter";
import DesignCardSkeleton from "../skeltons/DesignCardSkeleton";
import { createFilterChangeHandler } from "../../../helpers/handleFilterChagne";

export default function BrowseDesigns() {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") ?? "1");
    const sortByValue = searchParams.get("sortBy") ?? SORT_OPTIONS[0].value;
    const designStylesParam = searchParams.get("designStyles");
    const propertyTypesParam = searchParams.get("propertyTypes");
    const spaceTypesParam = searchParams.get("spaceTypes");

    const designStyles = designStylesParam ? designStylesParam.split(",").map((v) => ({ label: v, value: v })) : null;

    const propertyTypes = propertyTypesParam ? propertyTypesParam.split(",").map((v) => ({ label: v, value: v })) : null;

    const spaceTypes = spaceTypesParam ? spaceTypesParam.split(",").map((v) => ({ label: v, value: v })) : null;

    const selectedSort = SORT_OPTIONS.find((s) => s.value === sortByValue) ?? SORT_OPTIONS[0];


    const { data, isLoading, error } = useGetAllDesignsCommonQuery({
        page,
        designStyles,
        propertyTypes,
        spaceTypes,
        sortBy: selectedSort,
    });

    const totalDesigns = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const onFilterChange = createFilterChangeHandler(setSearchParams);
    const handlePageChange = (newPage: number) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", String(newPage));
            return next;
        });
    };


    const handleClearAll = () => {
        setSearchParams({ page: "1" });
    };

    if (error) return <div className="p-10 text-center text-red-500">Error loading designs.</div>;

    return (
        <div className="min-h-screen bg-gray-50/60 font-Jost">
            <DesignFilter
                designStyles={designStyles}
                propertyTypes={propertyTypes}
                spaceTypes={spaceTypes}
                sortBy={selectedSort}
                onFilterChange={onFilterChange}
                onClear={handleClearAll}
                filtersVisible={filtersVisible}
                setFiltersVisible={setFiltersVisible}
            />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isLoading
                        ? Array.from({ length: 8 }).map((_, i) => (
                            <DesignCardSkeleton key={i} />
                        ))
                        : data?.data?.map((item) => (
                            <DesignCard design={item} key={item.id} />
                        ))
                    }
                </div>
            </div>

            <Pagination
                page={page}
                totalItem={totalDesigns}
                whichItem="designs"
                totalPages={totalPages}
                onDecrease={() => handlePageChange(Math.max(1, page - 1))}
                onIncrease={() => handlePageChange(Math.min(totalPages, page + 1))}
            />
        </div>
    );
}