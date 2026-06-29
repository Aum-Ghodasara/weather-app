"use client";

import React, { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { getSmartDecisions, WeatherConditions } from "@/services/rule-engine";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  Home,
  HeartPulse,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

interface SmartDecisionsProps {
  weatherData: any;
}

// Map activities to logical categories for UI grouping
const CATEGORY_MAP: Record<string, string[]> = {
  "Health & Gear": [
    "Sunscreen",
    "Hydration",
    "Wear Mask",
    "Umbrella",
    "Jacket",
    "Hair Care",
  ],
  "Outdoors & Active": [
    "Walk",
    "Run",
    "Cycling",
    "Swimming",
    "Picnic",
    "Fly Kite",
    "Stargazing",
    "Walk Dog",
    "Photography",
  ],
  "Home & Auto": [
    "Laundry",
    "Wash Car",
    "Open Windows",
    "Water Plants",
    "Motorcycle",
  ],
};

function getCategoryIcon(category: string) {
  switch (category) {
    case "Health & Gear":
      return <HeartPulse className="w-5 h-5 text-rose-400" />;
    case "Outdoors & Active":
      return <Activity className="w-5 h-5 text-emerald-400" />;
    case "Home & Auto":
      return <Home className="w-5 h-5 text-blue-400" />;
    default:
      return <Sparkles className="w-5 h-5 text-purple-400" />;
  }
}

export default function SmartDecisions({ weatherData }: SmartDecisionsProps) {
  const groupedDecisions = useMemo(() => {
    if (!weatherData?.current || !weatherData?.hourly) return {};

    const currentHourISO = weatherData.current.time.slice(0, 13) + ":00";
    const hourIndex = weatherData.hourly.time.findIndex((t: string) =>
      t.startsWith(currentHourISO),
    );
    const safeIndex = hourIndex !== -1 ? hourIndex : 0;

    const conditions: WeatherConditions = {
      temp: weatherData.current.temperature_2m,
      humidity: weatherData.current.relative_humidity_2m,
      windSpeed: weatherData.current.wind_speed_10m,
      uvIndex: weatherData.hourly.uv_index[safeIndex] || 0,
      rainProb: weatherData.hourly.precipitation_probability[safeIndex] || 0,
      visibility: weatherData.hourly.visibility[safeIndex] || 10000,
      aqi: 50,
    };

    const allDecisions = getSmartDecisions(conditions);

    // Group decisions by category
    const grouped: Record<string, typeof allDecisions> = {
      "Health & Gear": [],
      "Outdoors & Active": [],
      "Home & Auto": [],
      Other: [],
    };

    allDecisions.forEach((decision) => {
      let placed = false;
      for (const [category, activities] of Object.entries(CATEGORY_MAP)) {
        if (activities.includes(decision.activity)) {
          grouped[category].push(decision);
          placed = true;
          break;
        }
      }
      if (!placed) grouped["Other"].push(decision);
    });

    return grouped;
  }, [weatherData]);

  if (Object.keys(groupedDecisions).length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full mt-12 mb-8">
      <div className="flex items-center gap-3 mb-8 px-2">
        <Sparkles className="w-6 h-6 text-slate-300" />
        {/* FIX: Title made white to pop against dark theme */}
        <h3 className="text-2xl font-semibold text-white tracking-wide">
          Your Day, Decoded
        </h3>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-10"
      >
        {Object.entries(groupedDecisions).map(([category, decisions]) => {
          if (decisions.length === 0) return null;

          return (
            <motion.div
              key={category}
              variants={itemVariant}
              className="w-full"
            >
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-4 px-2">
                {getCategoryIcon(category)}
                {/* FIX: Subheaders to light slate */}
                <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-sm">
                  {category}
                </h4>
              </div>

              {/* Bento Grid for Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {decisions.map((decision, idx) => {
                  const isYes = decision.recommendation === "Yes";
                  const isCaution = decision.recommendation === "Caution";

                  return (
                    <div
                      key={idx}
                      className={clsx(
                        // FIX: Replaced solid colors with dark glass, keeping it unified with other cards
                        "relative p-6 rounded-3xl bg-[#0f172a]/40 backdrop-blur-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-default group",
                        isYes
                          ? "border-white/5 hover:border-emerald-500/30"
                          : isCaution
                            ? "border-white/5 hover:border-amber-500/30"
                            : "border-white/5 hover:border-rose-500/30",
                      )}
                    >
                      <div className="relative z-10 flex items-start justify-between mb-4">
                        {/* FIX: Title text to white */}
                        <h4 className="font-semibold text-white text-lg tracking-wide">
                          {decision.activity}
                        </h4>

                        {/* FIX: Colors are strictly constrained to this badge only */}
                        <span
                          className={clsx(
                            "text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border",
                            isYes
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : isCaution
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20",
                          )}
                        >
                          {isYes && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {isCaution && (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                          {!isYes && !isCaution && (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          {decision.recommendation}
                        </span>
                      </div>
                      {/* FIX: Description text to slate-400 */}
                      <p className="relative z-10 text-sm font-medium text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                        {decision.reason}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
