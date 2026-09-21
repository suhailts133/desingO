import { LocateFixed } from "lucide-react";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import type { MapSelectedLocation } from "./LocationMapModal";

interface OnsiteLocationButtonProps {
    onResolved: (location: MapSelectedLocation) => void;
}

export default function OnsiteLocationButton({ onResolved }: OnsiteLocationButtonProps) {
    const { getCurrentLocation, isLocating, error } = useCurrentLocation();

    const handleClick = async () => {
        try {
            onResolved(await getCurrentLocation());
        } catch (error){
          console.log(error)
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <button
                type="button"
                onClick={handleClick}
                disabled={isLocating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-surface border-surface-border hover:border-surface-border-strong text-sm font-Jost-Semibold text-text-muted disabled:opacity-50"
            >
                <LocateFixed className="w-4 h-4" />
                {isLocating ? "Locating..." : "I'm Onsite — Use My Location"}
            </button>
            {error && <p className="text-xs text-error">{error}</p>}
        </div>
    );
}