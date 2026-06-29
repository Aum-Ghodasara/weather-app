"use client";

import React, { useState, useEffect } from "react";
import LocationSearch from "@/components/weather/LocationSearch";
import CurrentWeatherCard from "@/components/weather/CurrentWeatherCard";
import SmartDecisions from "@/components/weather/SmartDecisions";
import WeatherContext from "@/components/weather/WeatherContext";
import WeatherHighlights from "@/components/weather/WeatherHighlights";
import { useLocation } from "@/hooks/useLocation";
import { useWeather } from "@/hooks/useWeather";
import { Loader2, CloudRain, Star } from "lucide-react";
import WorldGlobe from "@/components/weather/WorldGlobe";
import ThemeWrapper from "@/components/layout/ThemeWrapper";
import clsx from "clsx";

// New type for saved locations
interface SavedLocation {
  label: string;
  lat: number;
  lon: number;
}

export default function Home() {
  const { location, loading: locLoading, refreshLocation } = useLocation();

  const [activeLat, setActiveLat] = useState<number | null>(null);
  const [activeLon, setActiveLon] = useState<number | null>(null);
  const [activeLabel, setActiveLabel] = useState<string>("Loading...");
  
  // Starred Locations & Unit State
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [starredLocations, setStarredLocations] = useState<SavedLocation[]>([]);

  // Load saved locations on mount
  useEffect(() => {
    const saved = localStorage.getItem("starredLocations");
    if (saved) {
      try { setStarredLocations(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (location && activeLat === null) {
      setActiveLat(location.lat);
      setActiveLon(location.lon);
      setActiveLabel(location.label);
    }
  }, [location, activeLat]);

  const { data: weather, loading: weatherLoading } = useWeather(activeLat, activeLon);

  const handleLocationSelect = (lat: number, lon: number, label: string) => {
    setActiveLat(lat);
    setActiveLon(lon);
    setActiveLabel(label);
  };

  const handleCurrentLocationClick = () => {
    refreshLocation();
    if (location) {
      setActiveLat(location.lat);
      setActiveLon(location.lon);
      setActiveLabel(location.label);
    }
  };

  // Toggle Star Logic
  const handleToggleStar = () => {
    if (!activeLabel || activeLat === null || activeLon === null || activeLabel === "Loading...") return;
    
    const isCurrentlyStarred = starredLocations.some(loc => loc.label === activeLabel);
    let newStarred;

    if (isCurrentlyStarred) {
      newStarred = starredLocations.filter(loc => loc.label !== activeLabel);
    } else {
      newStarred = [...starredLocations, { label: activeLabel, lat: activeLat, lon: activeLon }];
    }

    setStarredLocations(newStarred);
    localStorage.setItem("starredLocations", JSON.stringify(newStarred));
  };

  const isCurrentLocationStarred = starredLocations.some(loc => loc.label === activeLabel);

  return (
    <ThemeWrapper weatherData={weather}>
      <main className="min-h-screen py-8 px-4 sm:px-8 selection:bg-blue-500/30 font-sans flex justify-center">
        <div className="w-full max-w-5xl flex flex-col gap-6">
          
          {/* Header & Unit Toggle */}
          <header className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                <CloudRain className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white leading-none">Atmos</h1>
                <p className="text-slate-400 text-xs mt-1">Aurora weather intelligence</p>
              </div>
            </div>
            
            <div className="flex bg-[#0f172a]/60 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-lg">
              <button onClick={() => setUnit("C")} className={clsx("px-4 py-1.5 rounded-full text-xs font-bold transition-all", unit === "C" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white")}>°C</button>
              <button onClick={() => setUnit("F")} className={clsx("px-4 py-1.5 rounded-full text-xs font-bold transition-all", unit === "F" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white")}>°F</button>
            </div>
          </header>

          {/* Search Bar & Saved Locations */}
          <div className="w-full relative z-[100]">
            <LocationSearch
              onSelectLocation={handleLocationSelect}
              onCurrentLocationClick={handleCurrentLocationClick}
            />
            
            {/* Quick Access Starred Cities */}
            {starredLocations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {starredLocations.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLocationSelect(loc.lat, loc.lon, loc.label)}
                    className={clsx(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300",
                      activeLabel === loc.label
                        ? "bg-amber-400/10 border border-amber-400/30 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.1)]"
                        : "bg-[#0f172a]/40 backdrop-blur-md border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Star className={clsx("w-3.5 h-3.5", activeLabel === loc.label ? "fill-amber-400" : "text-slate-400")} />
                    {loc.label.split(',')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="w-full">
            {locLoading || weatherLoading ? (
              <div className="flex flex-col justify-center items-center h-96 gap-4">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-slate-400 animate-pulse text-sm font-medium tracking-wide">Gathering atmospheric data...</p>
              </div>
            ) : weather?.current ? (
              <div className="flex flex-col gap-6">
                
                {/* FIX: The entire hero section is now items-stretch. 
                  Both the left and right columns use `grid-rows-2` ensuring 
                  the horizontal gap dividing the top and bottom cards lines up flawlessly.
                */}
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-stretch min-h-[550px]">
                  
                  {/* Left Column */}
                  <div className="grid grid-rows-2 gap-6 h-full">
                    <div className="w-full h-full">
                      <CurrentWeatherCard
                        locationLabel={activeLabel}
                        temperature={weather.current.temperature_2m}
                        humidity={weather.current.relative_humidity_2m}
                        windSpeed={weather.current.wind_speed_10m}
                        isDay={weather.current.is_day}
                        unit={unit}
                        isStarred={isCurrentLocationStarred}
                        onToggleStar={handleToggleStar}
                      />
                    </div>
                    <div className="w-full h-full">
                      <WeatherContext weatherData={weather} />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="w-full h-full">
                    <WeatherHighlights weatherData={weather} unit={unit} />
                  </div>
                </div>

                <SmartDecisions weatherData={weather} />
                <WorldGlobe onSelectLocation={handleLocationSelect} />
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </ThemeWrapper>
  );
}