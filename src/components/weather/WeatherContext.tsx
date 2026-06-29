"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Activity } from "lucide-react";

export default function WeatherContext({ weatherData }: { weatherData: any }) {
  // ... your existing logic ...

  return (
   <motion.div 
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      // FIX: Added 'flex-1' right after w-full h-full
      className="w-full h-full flex-1 p-6 rounded-3xl bg-[#0f172a]/40 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col justify-center gap-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-blue-400" />
          {/* THE FIX: Lighter slate text for the headers */}
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Comfort Score</h3>
        </div>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-bold tracking-tighter text-emerald-400">
            87
          </span>
          <span className="text-slate-400 mb-1.5 text-sm font-medium">/ 100</span>
        </div>
        <p className="text-sm text-slate-300 mt-2 font-medium">Comfort reduced due to High heat.</p>
      </div>

      <div className="h-px w-full bg-white/10" />

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Atmosphere</h3>
        </div>
        {/* THE FIX: Ensure body text is readable against dark glass */}
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          Today is characterized by temperatures around 34°C.
        </p>
      </div>
    </motion.div>
  );
}