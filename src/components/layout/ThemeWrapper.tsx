"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ThemeWrapperProps {
  weatherData: any;
  children: React.ReactNode;
}

export default function ThemeWrapper({ weatherData, children }: ThemeWrapperProps) {
  const theme = useMemo(() => {
    if (!weatherData?.current) return "default";
    const temp = weatherData.current.temperature_2m;
    const code = weatherData.current.weather_code;

    if (code >= 51 && code <= 67) return "rain";
    if (code >= 71 && code <= 86) return "snow";
    if (temp > 30) return "hot";
    if (temp < 15) return "cold";
    return "pleasant";
  }, [weatherData]);

  // Aurora UI: Deep medium backgrounds with intensely colored, glowing floating orbs
  const themeConfig = {
    hot: {
      bg: "bg-slate-900",
      orb1: "bg-rose-600/40",
      orb2: "bg-amber-600/40",
    },
    cold: {
      bg: "bg-slate-900",
      orb1: "bg-blue-600/40",
      orb2: "bg-cyan-500/40",
    },
    rain: {
      bg: "bg-slate-900",
      orb1: "bg-indigo-600/40",
      orb2: "bg-slate-500/40",
    },
    snow: {
      bg: "bg-slate-900",
      orb1: "bg-sky-400/30",
      orb2: "bg-indigo-300/30",
    },
    pleasant: {
      bg: "bg-slate-900",
      orb1: "bg-emerald-500/30",
      orb2: "bg-teal-500/30",
    },
    default: {
      bg: "bg-slate-900",
      orb1: "bg-blue-500/30",
      orb2: "bg-purple-500/30",
    }
  };

  const currentTheme = themeConfig[theme as keyof typeof themeConfig];

  return (
    <div className={clsx("min-h-screen relative overflow-hidden transition-colors duration-1000 ease-in-out text-slate-100", currentTheme.bg)}>
      
      {/* Massive, ultra-blurred Aurora Orbs */}
      <motion.div
        animate={{
          x: [0, 150, -100, 0],
          y: [0, -150, 100, 0],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className={clsx("absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none mix-blend-screen", currentTheme.orb1)}
      />
      
      <motion.div
        animate={{
          x: [0, -200, 150, 0],
          y: [0, 200, -150, 0],
          scale: [1, 1.4, 0.9, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className={clsx("absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none mix-blend-screen", currentTheme.orb2)}
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}