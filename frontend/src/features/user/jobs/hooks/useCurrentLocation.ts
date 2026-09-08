import { useCallback } from "react";
import { useUserCoordinates } from "../../../../shared/hooks/useUserCoordinates";

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
  const { getCoordinates, isLocating, error } = useUserCoordinates();

  const getCurrentLocation = useCallback(async (): Promise<ResolvedLocation> => {
    const { latitude, longitude } = await getCoordinates();
    return reverseGeocode(latitude, longitude);
  }, [getCoordinates]);

  return { getCurrentLocation, isLocating, error };
}