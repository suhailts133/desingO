import Select, { type SingleValue } from "react-select";
import { LocateFixed } from "lucide-react";
import { RADIUS_OPTIONS, type OptionType } from "../../baseData";

type Props = {
    hasLocation: boolean;
    radiusValue: OptionType;
    isLocating: boolean;
    error: string | null;
    onUseMyLocation: () => void;
    onRadiusChange: (selected: SingleValue<OptionType>) => void;
};

export default function JobLocationFilter({
    hasLocation,
    radiusValue,
    isLocating,
    error,
    onUseMyLocation,
    onRadiusChange,
}: Props) {
    return (
        <span className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <button
                    onClick={onUseMyLocation}
                    disabled={isLocating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all
                        ${hasLocation ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}
                        disabled:opacity-50`}
                >
                    <LocateFixed className="w-4 h-4" />
                    {isLocating ? "Locating..." : hasLocation ? "Near Me" : "Use My Location"}
                </button>

                {hasLocation && (
                    <div className="min-w-40">
                        <Select
                            value={radiusValue}
                            onChange={onRadiusChange}
                            options={RADIUS_OPTIONS}
                            isSearchable={false}
                        />
                    </div>
                )}
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
        </span>
    );
}