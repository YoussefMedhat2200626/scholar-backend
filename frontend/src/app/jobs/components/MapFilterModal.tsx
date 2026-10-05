"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { X, Check } from "lucide-react";

// Dynamically import MapComponent so Leaflet doesn't crash on the server
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#151c2c] rounded-2xl border border-white/10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70B5DF]"></div>
    </div>
  ),
});

interface MapFilterModalProps {
  countryJobCounts?: Record<string, number>;
  isOpen: boolean;
  onClose: () => void;
  selectedCountries: string[];
  onToggleCountry: (country: string) => void;
  onConfirm: () => void;
}

export default function MapFilterModal({
  isOpen,
  onClose,
  selectedCountries,
  onToggleCountry,
  onConfirm,
  countryJobCounts = {}
}: MapFilterModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/40 dark:bg-neutral-900/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Content */}
      <div className={`relative w-full h-[85vh] max-w-6xl bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white tracking-wide uppercase">Select Region</h2>
            {selectedCountries.length > 0 && (
              <span className="bg-primary-50 dark:bg-cyan-500/10 text-primary-700 dark:text-cyan-400 text-xs font-bold px-2 py-1 rounded-md border border-primary-200 dark:border-cyan-500/20">
                {selectedCountries.length} Selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-colors text-sm font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex items-center gap-2 bg-[#70B5DF] hover:bg-[#5da0c9] text-neutral-900 px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(112,181,223,0.3)] hover:shadow-[0_0_20px_rgba(112,181,223,0.5)] cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Confirm
            </button>
          </div>
        </div>

        {/* Map Body */}
        <div className="flex-1 w-full bg-neutral-100 dark:bg-neutral-900 p-4">
          <MapComponent 
            selectedCountries={selectedCountries} 
            onToggleCountry={onToggleCountry} 
            countryJobCounts={countryJobCounts} 
          />
        </div>

        {/* Footer info */}
        {selectedCountries.length > 0 && (
          <div className="px-6 py-3 border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 overflow-x-auto whitespace-nowrap custom-scrollbar">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-700 dark:text-neutral-400 font-bold">Selected: </span>
              {selectedCountries.map((c) => (
                <span key={c} className="bg-neutral-200 dark:bg-white/5 text-neutral-800 dark:text-neutral-300 px-2 py-1 rounded text-xs border border-neutral-300 dark:border-white/10 inline-flex items-center gap-2">
                  {c}
                  <button 
                    onClick={() => onToggleCountry(c)}
                    className="hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
