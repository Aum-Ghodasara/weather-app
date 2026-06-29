"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cloud, Droplets, Wind, Sun, MapPin, Star } from "lucide-react";
import clsx from "clsx";

interface CurrentWeatherCardProps {
  locationLabel: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  isDay: number;
  unit: "C" | "F";
  isStarred: boolean; // NEW
  onToggleStar: () => void; // NEW
}

export default function CurrentWeatherCard({
  locationLabel,
  temperature,
  humidity,
  windSpeed,
  isDay,
  unit,
  isStarred,
  onToggleStar,
}: CurrentWeatherCardProps) {
  const displayTemp = unit === "F" ? (temperature * 9) / 5 + 32 : temperature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full p-8 rounded-3xl bg-[#0f172a]/40 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between"
    >
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header with Star Button */}
      <div className="relative z-10 flex justify-between items-center w-full text-slate-300">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold tracking-wide">Current Location</h2>
        </div>
        
        <button 
          onClick={onToggleStar}
          title={isStarred ? "Remove from favorites" : "Save location"}
          className={clsx(
            "p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
            isStarred 
              ? "bg-amber-400/10 text-amber-400 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]" 
              : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
          )}
        >
          <Star className={clsx("w-4 h-4 transition-colors", isStarred && "fill-amber-400")} />
        </button>
      </div>
      
      {/* Massive Temperature & Icon */}
      <div className="relative z-10 flex flex-col items-center justify-center my-4">
        {isDay ? (
          <Sun className="w-24 h-24 text-yellow-400 mb-2 drop-shadow-xl" />
        ) : (
          <Cloud className="w-24 h-24 text-slate-300 mb-2 drop-shadow-xl" />
        )}
        <h1 className="text-8xl font-black text-white tracking-tighter">
          {Math.round(displayTemp)}°
        </h1>
        <p className="text-2xl text-slate-300 font-medium mt-2 text-center px-4">
          {locationLabel}
        </p>
      </div>

      {/* Footer Stats */}
      <div className="relative z-10 grid grid-cols-2 gap-4 w-full pt-6 border-t border-white/10">
        <div className="flex items-center justify-center gap-2">
          <Droplets className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-semibold text-white">{humidity}% Humidity</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Wind className="w-5 h-5 text-teal-400" />
          <span className="text-sm font-semibold text-white">{windSpeed} km/h</span>
        </div>
      </div>
    </motion.div>
  );
}