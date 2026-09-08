import { useState } from "react";
import { MapPin } from "lucide-react";
import LocationMapModal, { type MapSelectedLocation } from "./LocationMapModal";

interface MapLocationButtonProps {
    onResolved: (location: MapSelectedLocation) => void;
}

export default function MapLocationButton({ onResolved }: MapLocationButtonProps) {
    const [showMap, setShowMap] = useState(false);

    const handleConfirm = (loc: MapSelectedLocation) => {
        onResolved(loc);
        setShowMap(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setShowMap(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blush text-sm font-Jost-Semibold text-soft-black"
            >
                <MapPin className="w-4 h-4" />
                Pick Location on Map
            </button>

            {showMap && <LocationMapModal onConfirm={handleConfirm} onClose={() => setShowMap(false)} />}
        </>
    );
}