import { useState, useEffect } from "react";
import { getWeatherData } from "@/services/open-meteo";

export function useWeather(lat: number | null, lon: number | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lon === null) return;

   // Inside src/hooks/useWeather.ts

const fetchWeather = async () => {
  // ✅ ADD THIS GUARD CLAUSE:
  if (lat === null || lon === null) {
    return; // Exit early if we don't have coordinates yet
  }

  setLoading(true);
  setError(null);
  
  try {
    // TypeScript now knows lat and lon are 100% strictly numbers here
    const weatherData = await getWeatherData(lat, lon); 
    setData(weatherData);
  } catch (err) {
    setError("Failed to fetch weather data.");
  } finally {
    setLoading(false);
  }
};

    fetchWeather();
  }, [lat, lon]);

  return { data, loading, error };
}