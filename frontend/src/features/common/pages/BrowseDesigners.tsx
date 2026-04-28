import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetAllDesignersQuery } from "../commonEndpoints";
import DesignerCard from "../components/cards/DesignerCard";
import type { DesingerFilterForm } from "../commonInterface";
import Pagination from "../../../shared/common/Pagination";
import DesignerFilter from "../components/filters/DesignerFilter";

export default function BrowseDesigners() {
    const [page, setPage] = useState(1);
    const [debouncedName, setDebouncedName] = useState("");
    const { watch, reset, register } = useForm<DesingerFilterForm>({
        defaultValues: {
            full_name: ""
        },
    });

    const full_name = watch("full_name");
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(full_name);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [full_name]);


    const { data, isLoading, error } = useGetAllDesignersQuery({
        full_name: debouncedName,
        page,
    });

    const designers = data?.data;
    console.log(designers)
    const handleClearAll = () => {
        reset({ full_name: "" });
        setDebouncedName("")
        setPage(1);
    };

    if (isLoading) {
        return <div className="p-10 text-center animate-pulse text-gray-400 font-Jost">Loading designers...</div>;
    }

    if (error || !designers) {
        return <div className="p-10 text-center text-red-500 font-Jost-Semibold">Error loading designers.</div>;
    }

    const totalDesigners = data.total ?? 0;
    const totalPages = data.totalPages ?? 1;

    return (
        <div className="min-h-screen bg-gray-50/60 font-Jost">

            <DesignerFilter
                register={register}
                onClear={handleClearAll}
            />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {designers.map((data) => (
                        <DesignerCard data={data} key={data.designerId} />
                    ))}
                </div>
            </div>

            <Pagination
                page={page}
                totalItem={totalDesigners}
                whichItem="designers"
                totalPages={totalPages}
                onDecrease={() => setPage(p => p - 1)}
                onIncrease={() => setPage(p => p + 1)}
            />
        </div>
    );
}