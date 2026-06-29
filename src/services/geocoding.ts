export interface LocationResult {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

/**
 * Fetches matching locations from OpenStreetMap Nominatim API.
 * Free, open-source, and requires no API key.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "AtmosWeatherExperience/1.0 (portfolio project)",
      },
    });

    if (!response.ok) return "Unknown Location";

    const data = await response.json();
    
    // Attempt to extract the most logical name from the response
    const name = data.address?.city || 
                 data.address?.town || 
                 data.address?.village || 
                 data.address?.county || 
                 data.address?.country || 
                 "Selected Coordinate";
                 
    return name;
  } catch (error) {
    console.error("Reverse geocoding failed", error);
    return "Selected Location";
  }
}

export async function searchLocations(query: string): Promise<LocationResult[]> {
  if (!query || query.trim().length < 3) return [];

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}&addressdetails=1&limit=5`;

  try {
    const response = await fetch(url, {
      headers: {
        // Nominatim policy requires a descriptive User-Agent
        "User-Agent": "AtmosWeatherExperience/1.0 (portfolio project)",
      },
    });

    if (!response.ok) throw new Error("Geocoding request failed");

    const data = await response.json();

    return data.map((item: any) => {
      const city = item.address?.city || item.address?.town || item.address?.village || item.address?.suburb || "";
      const state = item.address?.state || "";
      const country = item.address?.country || "";
      
      // Build a clean, short display title
      const shortName = city ? `${city}, ${country}` : item.display_name.split(",")[0];

      return {
        id: item.place_id.toString(),
        name: shortName,
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        country,
        state,
      };
    });
  } catch (error) {
    console.error("Geocoding service error:", error);
    return [];
  }
}