import { useState, useEffect, useCallback } from "react";

export interface Coordinates {
  lat: number;
  lon: number;
  label: string;
}

// Default to Ahmedabad, India if permission is denied
const DEFAULT_COORDINATES: Coordinates = {
  lat: 23.0225,
  lon: 72.5714,
  label: "Ahmedabad, India",
};

export function useLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrowserLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLocation(DEFAULT_COORDINATES);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          label: "Current Location",
        });
        setLoading(false);
      },
      (err) => {
        console.warn(`Geolocation error (${err.code}): ${err.message}. Reverting to default.`);
        setError("Location access denied.");
        setLocation(DEFAULT_COORDINATES);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    fetchBrowserLocation();
  }, [fetchBrowserLocation]);

  return {
    location,
    setLocation,
    loading,
    error,
    refreshLocation: fetchBrowserLocation,
  };
}