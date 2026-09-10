import { useLocationFields } from "../hooks/useLocationFields";
import MapLocationButton from "./MapLocationButton";
import OnsiteLocationButton from "./OnSiteLocationButton";

export default function LocationCaptureButtons() {
    const { latitude, longitude, applyResolvedLocation, latitudeError } = useLocationFields();

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
                <OnsiteLocationButton onResolved={applyResolvedLocation} />
                <MapLocationButton onResolved={applyResolvedLocation} />

                {latitude != null && longitude != null && (
                    <span className="text-xs text-soft-black/60">
                        Location set: {latitude.toFixed(5)}, {longitude.toFixed(5)}
                    </span>
                )}
            </div>

            {latitudeError && <p className="text-xs text-red-500">{latitudeError}</p>}
        </div>
    );
}