"use client";

import React from "react";
import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import worldGeoJSON from "@/src/data/world.geo.json";
import { GeoJsonObject } from "geojson";
import { useTheme } from "@/src/hooks/useTheme";

interface MapComponentProps {
  countryJobCounts?: Record<string, number>;
  selectedCountries: string[];
  onToggleCountry: (country: string) => void;
}

export default function MapComponent({ selectedCountries, onToggleCountry, countryJobCounts = {} }: MapComponentProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const selectedCountriesRef = React.useRef(selectedCountries);
  const geoJsonRef = React.useRef<any>(null);

  React.useEffect(() => {
    selectedCountriesRef.current = selectedCountries;
    if (geoJsonRef.current) {
      geoJsonRef.current.eachLayer((layer: any) => {
        const countryName = layer.feature.properties.name;
        const isSelected = selectedCountries.includes(countryName);
        layer.setStyle({
          fillColor: isSelected ? "#70B5DF" : isDark ? "#1a2336" : "#e2e8f0",
        });
      });
    }
  }, [selectedCountries, isDark]);

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  
  const countryCenters: Record<string, [number, number]> = {
    "Egypt": [26.8206, 30.8025],
    "Saudi Arabia": [23.8859, 45.0792],
    "United Arab Emirates": [23.4241, 53.8478],
    "United States of America": [39.8283, -98.5795],
    "United Kingdom": [55.3781, -3.4360],
    "Germany": [51.1657, 10.4515],
    "France": [46.2276, 2.2137],
    "Canada": [56.1304, -106.3468],
    "Australia": [-25.2744, 133.7751],
    "India": [20.5937, 78.9629],
  };

  const createCustomIcon = (count: number, isDark: boolean) => {
    return L.divIcon({
      html: `<div class="w-8 h-8 rounded-full ${isDark ? 'bg-[#1a2336]' : 'bg-white'} border-2 border-[#70B5DF] ${isDark ? 'text-white' : 'text-neutral-900'} flex items-center justify-center font-bold text-xs shadow-lg" style="transform: translate(-50%, -50%);">${count}</div>`,
      className: '',
      iconSize: [0, 0], // Center the div
      iconAnchor: [0, 0],
    });
  };

  // Pre-calculate markers for countries with jobs
  const markers = Object.entries(countryJobCounts)
    .filter(([country, count]) => count > 0 && countryCenters[country])
    .map(([country, count]) => (
      <Marker 
        key={country} 
        position={countryCenters[country]} 
        icon={createCustomIcon(count, isDark)} 
        eventHandlers={{
          click: () => {
            onToggleCountry(country);
          }
        }}
      />
    ));

  const geoJsonStyle = (feature: any) => {
    const isSelected = selectedCountries.includes(feature.properties.name);
    return {
      fillColor: isSelected ? "#70B5DF" : isDark ? "#1a2336" : "#e2e8f0",
      weight: 1,
      opacity: 1,
      color: isDark ? "#2a3441" : "#cbd5e1",
      fillOpacity: isSelected ? 0.7 : 0.85,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const countryName = feature.properties.name;
    
    // Bind a simple tooltip on hover
    const count = countryJobCounts[countryName] || 0;
    
    // Bind a simple tooltip on hover
    layer.bindTooltip(`${countryName}: ${count} job${count === 1 ? '' : 's'} available`, {
      className: isDark
        ? "bg-[#151c2c] border border-[#2a3441] text-white px-2 py-1 rounded shadow-lg"
        : "bg-white border border-neutral-200 text-neutral-900 px-2 py-1 rounded shadow-lg",
      direction: "top"
    });

    layer.on({
      mouseover: (e: any) => {
        const target = e.target;
        if (!selectedCountriesRef.current.includes(countryName)) {
          target.setStyle({
            fillColor: isDark ? "#3a4a5e" : "#cbd5e1",
            fillOpacity: 0.9,
          });
        }
      },
      mouseout: (e: any) => {
        const target = e.target;
        if (!selectedCountriesRef.current.includes(countryName)) {
          target.setStyle({
            fillColor: isDark ? "#1a2336" : "#e2e8f0",
            fillOpacity: isDark ? 0.8 : 0.85,
          });
        }
      },
      click: () => {
        onToggleCountry(countryName);
      },
    });
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(112,181,223,0.1)] border border-neutral-200 dark:border-white/10 transition-colors">
      <MapContainer
        center={[26, 30]} // Focus roughly on Egypt
        zoom={3}
        style={{ height: "100%", width: "100%", background: isDark ? "#0a0f18" : "#f1f5f9" }}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          key={`tile-${theme}`}
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          className={isDark ? "dark-map-tiles" : ""}
        />
        {markers}
        <GeoJSON 
          ref={geoJsonRef}
          key={`geojson-${theme}`}
          data={worldGeoJSON as GeoJsonObject} 
          style={geoJsonStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
}
