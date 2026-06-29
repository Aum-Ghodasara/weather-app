import { useState, useEffect } from "react";
import { getWeatherData } from "@/services/open-meteo";

export function useWeather(lat: number | null, lon: number | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lon === null) return;

    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        const weatherData = await getWeatherData(lat, lon);
        setData(weatherData);
      } catch (err) {
        setError("Failed to fetch weather data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [lat, lon]);

  return { data, loading, error };
}