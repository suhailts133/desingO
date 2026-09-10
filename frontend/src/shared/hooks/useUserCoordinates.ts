import { useCallback, useState } from "react";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useUserCoordinates() {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCoordinates = useCallback((): Promise<Coordinates> => {
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
        (pos) => {
          setIsLocating(false);
          resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
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

  return { getCoordinates, isLocating, error };
}