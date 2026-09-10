import { useState } from "react";
import type { SingleValue } from "react-select";
import { RADIUS_OPTIONS, SORT_OPTIONS, type OptionType } from "../baseData";
import { useGetAllJobsCommonQuery } from "../../user/jobs/jobEndpoints";
import JobCard from "../components/cards/JobCard";
import Pagination from "../../../shared/common/Pagination";
import JobFilter from "../components/filters/JobFilter";
import { useSearchParams } from "react-router-dom";
import { createFilterChangeHandler } from "../../../helpers/handleFilterChagne";
import { useUserCoordinates } from "../../../shared/hooks/useUserCoordinates";

export default function BrowseJobs() {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const { getCoordinates, isLocating, error: locationError } = useUserCoordinates();

    const page = Number(searchParams.get("page") ?? "1");
    const sortByValue = searchParams.get("sortBy") ?? SORT_OPTIONS[0].value;
    const designStylesParam = searchParams.get("designStyles");
    const propertyTypesParam = searchParams.get("propertyTypes");
    const timeLinesParam = searchParams.get("timeLines");
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const radiusKmParam = searchParams.get("radiusKm") ?? RADIUS_OPTIONS[1].value;

    const designStyles = designStylesParam ? designStylesParam.split(",").map((v) => ({ label: v, value: v })) : null;
    const propertyTypes = propertyTypesParam ? propertyTypesParam.split(",").map((v) => ({ label: v, value: v })) : null;
    const timeLines = timeLinesParam ? timeLinesParam.split(",").map((v) => ({ label: v, value: v })) : null;
    const selectedSort = SORT_OPTIONS.find((s) => s.value === sortByValue) ?? SORT_OPTIONS[0];
    const selectedRadius = RADIUS_OPTIONS.find((r) => r.value === radiusKmParam) ?? RADIUS_OPTIONS[1];

    const lat = latParam ? Number(latParam) : null;
    const lng = lngParam ? Number(lngParam) : null;
    const hasLocation = lat != null && lng != null;

    const { data, isLoading, error } = useGetAllJobsCommonQuery({
        page,
        designStyles,
        propertyTypes,
        timeLines,
        sortBy: selectedSort,
        lat: hasLocation ? lat : null,
        lng: hasLocation ? lng : null,
        radiusKm: hasLocation ? selectedRadius.value : null,
    });

    const jobs = data?.data

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

    const handleUseMyLocation = async () => {
        try {
            const { latitude, longitude } = await getCoordinates();
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("lat", String(latitude));
                next.set("lng", String(longitude));
                if (!next.get("radiusKm")) next.set("radiusKm", RADIUS_OPTIONS[1].value);
                next.set("page", "1");
                return next;
            });
        } catch (error){
            console.error("Failed to fetch location:", error);
        }
    };

    const handleRadiusChange = (selected: SingleValue<OptionType>) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("radiusKm", selected?.value ?? RADIUS_OPTIONS[1].value);
            next.set("page", "1");
            return next;
        });
    };

    if (isLoading) {
        return <div className="p-10 text-center animate-pulse text-gray-400 font-Jost">Loading jobs...</div>;
    }

    if (error || !jobs) {
        return <div className="p-10 text-center text-red-500 font-Jost-Semibold">Error loading jobs.</div>;
    }

    const totalJobs = data.total ?? 0
    const totalPages = data.totalPages ?? 1

    return (
        <div className="min-h-screen bg-gray-50/60 font-Jost">

            <JobFilter
                designStyles={designStyles}
                propertyTypes={propertyTypes}
                timeLines={timeLines}
                sortBy={selectedSort}
                onFilterChange={onFilterChange}
                onClear={handleClearAll}
                filtersVisible={filtersVisible}
                setFiltersVisible={setFiltersVisible}
                hasLocation={hasLocation}
                radiusValue={selectedRadius}
                isLocating={isLocating}
                locationError={locationError}
                onUseMyLocation={handleUseMyLocation}
                onRadiusChange={handleRadiusChange}
            />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {jobs.map(data => (

                        <JobCard job={data} key={data.id} />
                    ))}
                </div>
            </div>

            <Pagination
                page={page}
                totalItem={totalJobs}
                whichItem="jobs"
                totalPages={totalPages}
                onDecrease={() => handlePageChange(Math.max(1, page - 1))}
                onIncrease={() => handlePageChange(Math.min(totalPages, page + 1))}
            />
        </div>
    );
}