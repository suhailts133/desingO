import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import MapSearchControl from "./MapSearchControl";

interface AddressDetails {
  state?: string;
  postcode?: string;
  state_district?: string;
  district?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
}

interface NominatimResponse {
  display_name: string;
  address: AddressDetails;
}

export interface MapSelectedLocation {
  latitude: number;
  longitude: number;
  city: string;
  district: string;
  state: string;
  pincode: string;
  formatted: string;
}

interface LocationMapModalProps {
  initialPosition?: [number, number];
  onConfirm: (location: MapSelectedLocation) => void;
  onClose: () => void;
}

async function reverseGeocode(lat: number, lon: number): Promise<MapSelectedLocation> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    { headers: { "User-Agent": "designO/1.0" } }
  );
  const data = (await response.json()) as NominatimResponse;
  const address = data.address || {};

  return {
    latitude: lat,
    longitude: lon,
    city: address.city || address.town || address.village || address.county || "",
    district: address.district || address.state_district || "",
    state: address.state || "",
    pincode: address.postcode || "",
    formatted: data.display_name || "",
  };
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationMapModal({
  initialPosition = [10.7735, 76.3776],
  onConfirm,
  onClose,
}: LocationMapModalProps) {
  const [position, setPosition] = useState<[number, number]>(initialPosition);
  const [resolved, setResolved] = useState<MapSelectedLocation | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const handlePick = async (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setIsResolving(true);
    try {
      setResolved(await reverseGeocode(lat, lng));
    } catch {
      setResolved({
        latitude: lat,
        longitude: lng,
        city: "",
        district: "",
        state: "",
        pincode: "",
        formatted: "",
      });
    } finally {
      setIsResolving(false);
    }
  };
  return (
    <div className="fixed inset-0 z-2000 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-surface-border">
          <h4 className="font-Jost-Semibold text-text-primary">Pick Project Location</h4>
          <button type="button" onClick={onClose} aria-label="Close map" className="text-text-faint hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <MapContainer center={position} zoom={13} style={{ height: "350px", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onPick={handlePick} />
            <MapSearchControl onSelectLocation={handlePick} />
            <Marker position={position}>
              <Popup>{resolved?.formatted || "Click the map or search to set location"}</Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="p-4 flex items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            {isResolving ? "Resolving address..." : resolved?.formatted || "Location selected — fill in address details below"}
          </p>
          <button
            type="button"
            disabled={!resolved || isResolving}
            onClick={() => resolved && onConfirm(resolved)}
            className="shrink-0 px-4 py-2 bg-accent text-text-on-accent enabled:hover:bg-accent-hover enabled:active:bg-accent-active rounded-lg text-sm font-Jost-Semibold disabled:opacity-40"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}