"use client";
import React from "react";
import { motion } from "framer-motion";
import { Thermometer, Eye, SunDim, CloudRain } from "lucide-react";

export default function WeatherHighlights({ weatherData, unit }: { weatherData: any, unit: "C" | "F" }) {
  if (!weatherData?.current || !weatherData?.hourly) return null;
  const safeIndex = 0; 

  const uv = weatherData.hourly.uv_index[safeIndex] || 6;
  const rainChance = weatherData.hourly.precipitation_probability[safeIndex] || 3;
  const visibility = ((weatherData.hourly.visibility[safeIndex] || 50000) / 1000).toFixed(1); 
  
  const apparentC = weatherData.current.apparent_temperature;
  const actualC = weatherData.current.temperature_2m;
  const feelsLike = unit === "F" ? (apparentC * 9) / 5 + 32 : apparentC;
  
  const feelsLikeDesc = apparentC < actualC ? "Cooler than actual" : apparentC > actualC ? "Warmer than actual" : "Same as actual";
  const uvDesc = uv > 7 ? "Very High" : uv > 5 ? "High" : "Low";
  const visDesc = Number(visibility) > 10 ? "Crystal clear" : "Hazy conditions";
  const rainDesc = rainChance > 50 ? "Likely" : "Unlikely";

  const highlights = [
    { label: "Feels Like", value: `${Math.round(feelsLike)}°`, desc: feelsLikeDesc, icon: Thermometer, color: "text-orange-400", showBar: false },
    { label: "UV Index", value: `${uv}`, desc: uvDesc, icon: SunDim, color: "text-yellow-400", showBar: true, barPercent: (uv / 11) * 100, barColor: "bg-yellow-400" },
    { label: "Visibility", value: `${visibility} km`, desc: visDesc, icon: Eye, color: "text-blue-400", showBar: false },
    { label: "Rain Prob", value: `${rainChance}%`, desc: rainDesc, icon: CloudRain, color: "text-cyan-400", showBar: true, barPercent: rainChance, barColor: "bg-cyan-400" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      // FIX: Ensure grid takes full height, removed aspect-square from children
      className="w-full h-full grid grid-cols-2 gap-6"
    >
      {highlights.map((item, idx) => (
        <div 
          key={idx} 
          className="relative overflow-hidden p-6 rounded-3xl bg-[#0f172a]/40 backdrop-blur-2xl border border-white/10 flex flex-col justify-between hover:bg-white/5 transition-colors shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{item.label}</span>
          </div>
          
          <div className="relative z-10 mt-auto">
            <span className="text-4xl font-bold text-white tracking-tight">{item.value}</span>
            
            {/* Added progress bars back for visual weight */}
            {item.showBar && (
              <div className="w-full h-1.5 bg-slate-700/50 rounded-full mt-4 mb-1 overflow-hidden">
                <div className={`h-full ${item.barColor} rounded-full`} style={{ width: `${item.barPercent}%` }}></div>
              </div>
            )}
            
            {/* Added descriptions back to fill the empty space */}
            <p className={`text-sm font-medium text-slate-400 ${!item.showBar ? 'mt-3' : 'mt-2'}`}>
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}