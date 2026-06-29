// src/services/open-meteo.ts

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeatherData(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m",
    hourly: "temperature_2m,precipitation_probability,uv_index,visibility",
    timezone: "auto"
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    next: { revalidate: 1800 } // Next.js cache: Revalidate every 30 minutes
  });

  if (!response.ok) throw new Error("Failed to fetch weather data");
  return response.json();
}