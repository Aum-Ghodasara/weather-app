"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, Star, History } from "lucide-react";
import { searchLocations, LocationResult } from "@/services/geocoding";

interface LocationSearchProps {
  onSelectLocation: (lat: number, lon: number, label: string) => void;
  onCurrentLocationClick: () => void;
}

export default function LocationSearch({
  onSelectLocation,
  onCurrentLocationClick,
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce API calls to respect Nominatim rate limits
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const locations = await searchLocations(query);
      setResults(locations);
      setLoading(false);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto z-50">
      {/* Search Input Bar */}
      <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1 shadow-lg transition-all duration-300 focus-within:border-white/40 focus-within:bg-white/15">
        <Search className="w-5 h-5 text-white/60 ml-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search city..."
          className="w-full bg-transparent text-white placeholder-white/50 px-3 py-2 text-sm focus:outline-none"
        />
        {loading ? (
          <Loader2 className="w-5 h-5 text-white/60 animate-spin mr-3" />
        ) : (
          <button
            onClick={onCurrentLocationClick}
            className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors duration-200"
            title="Use current location"
          >
            <MapPin className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (query.length >= 3 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 z-[100]">
          {results.length === 0 && !loading ? (
            <div className="p-4 text-sm text-white/50 text-center">
              No cities found
            </div>
          ) : (
            <div className="py-2">
              {results.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc.lat, loc.lon, loc.name);
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 flex items-start gap-3 transition-colors duration-150 border-b border-white/5 last:border-none"
                >
                  <MapPin className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{loc.name}</p>
                    <p className="text-xs text-white/40 truncate mt-0.5">
                      {loc.displayName}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
