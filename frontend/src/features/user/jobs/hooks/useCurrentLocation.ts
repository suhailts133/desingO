import { useCallback, useState } from "react";

const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

export interface ResolvedLocation {
  latitude: number;
  longitude: number;
  city: string;
  district: string;
  state: string;
  pincode: string;
  formatted: string;
}

interface OpenCageComponents {
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  city_district?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
}

interface OpenCageResponse {
  status: { code: number; message: string };
  results: { formatted: string; components: OpenCageComponents }[];
}

function emptyResolvedLocation(lat: number, lng: number): ResolvedLocation {
  return { latitude: lat, longitude: lng, city: "", district: "", state: "", pincode: "", formatted: "" };
}

async function reverseGeocode(lat: number, lng: number): Promise<ResolvedLocation> {
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${OPENCAGE_API_KEY}`;
    const response = await fetch(url);
    const data = (await response.json()) as OpenCageResponse;

    if (data.status.code !== 200 || !data.results.length) {
      return emptyResolvedLocation(lat, lng);
    }

    const { components, formatted } = data.results[0];

    return {
      latitude: lat,
      longitude: lng,
      city: components.city || components.town || components.village || components.county || "",
      district: components.city_district || components.state_district || "",
      state: components.state || "",
      pincode: components.postcode || "",
      formatted,
    };
  } catch (error) {
    console.error("Reverse geocoding failed", error);
    return emptyResolvedLocation(lat, lng);
  }
}

export function useCurrentLocation() {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback((): Promise<ResolvedLocation> => {
    setError(null);
    setIsLocating(true);

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = "Geolocation is not supported by this browser.";
        setError(err);
        setIsLocating(false);
        reject(new Error(err));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const resolved = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          setIsLocating(false);
          resolve(resolved);
        },
        (err) => {
          setIsLocating(false);
          setError(err.message);
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }, []);

  return { getCurrentLocation, isLocating, error };
}