"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Loader2, Globe as GlobeIcon } from "lucide-react";
import { reverseGeocode } from "@/services/geocoding";

// Dynamic import with SSR disabled to prevent Turbopack/hydration errors
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full animate-pulse bg-white/5 rounded-3xl" />,
});

export default function WorldGlobe({ onSelectLocation }: { onSelectLocation: any }) {
  const [isClient, setIsClient] = useState(false);
  const [loadingCoord, setLoadingCoord] = useState(false);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.2; 
      controls.enableZoom = true;
      
      // Default starting view
      globeRef.current.pointOfView({ lat: 22, lng: 77, altitude: 2.0 });
    }
  }, [isClient]);

  const handleInteraction = async (lat: number, lng: number) => {
    setLoadingCoord(true);
    // Because there are no pre-defined labels, we always reverse-geocode the click
    const resolvedLabel = await reverseGeocode(lat, lng);
    setLoadingCoord(false);
    
    onSelectLocation(lat, lng, resolvedLabel);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isClient) return <div className="h-[500px] w-full max-w-4xl mx-auto animate-pulse bg-white/5 rounded-3xl mt-12 mb-16" />;

  return (
    // 1. Master container constraints the width so the header and globe align perfectly
    <div className="w-full max-w-4xl mx-auto mt-12 mb-16 px-4">
      
      {/* 2. Header now sits on the left side of the container */}
      <div className="flex items-center gap-2 mb-6 text-left">
        <GlobeIcon className="w-6 h-6 text-blue-400" />
        <h3 className="text-2xl font-semibold text-white/90 tracking-wide">
          World Weather
        </h3>
      </div>

      {/* 3. The Globe Container */}
      <div className="relative w-full h-[500px] rounded-3xl overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-white/10 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-2xl">
        
        {/* Loading Overlay */}
        {loadingCoord && (
          <div className="absolute inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-4" />
            <p className="text-white/80 font-medium tracking-widest uppercase text-sm">Triangulating...</p>
          </div>
        )}

        {/* The Clean Globe (No markers, no rings) */}
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.15}
          onGlobeClick={({ lat, lng }) => handleInteraction(lat, lng)}
        />
        
        {/* Helper text overlay */}
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
          <span className="bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium text-white/60 border border-white/10 uppercase tracking-widest shadow-xl">
            Spin and click anywhere
          </span>
        </div>
      </div>
    </div>
  );
}