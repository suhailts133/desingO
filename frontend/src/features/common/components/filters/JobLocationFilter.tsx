import Select, { type SingleValue, type StylesConfig } from "react-select";
import { LocateFixed } from "lucide-react";
import { RADIUS_OPTIONS, type OptionType } from "../../baseData";
import { selectStyles } from "../../../../shared/filter/selectStyle";

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
                        ${hasLocation ? "bg-accent text-text-on-accent border-accent" : "bg-surface text-text-muted border-surface-border hover:border-surface-border-strong"}
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
                            styles={selectStyles as StylesConfig<OptionType, false>}
                        />
                    </div>
                )}
            </div>

            {error && <p className="text-xs text-error">{error}</p>}
        </span>
    );
}