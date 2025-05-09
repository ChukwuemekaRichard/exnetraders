"use client";
import React, { useState } from "react";

export default function GlobalPresenceMap() {
  const [activeRegion, setActiveRegion] = useState(null);

  // Office locations data
  const officeLocations = {
    americas: [
      {
        id: "ny",
        name: "New York",
        country: "United States",
        role: "Headquarters",
        coords: { x: 25, y: 36 },
      },
      {
        id: "to",
        name: "Toronto",
        country: "Canada",
        role: "Regional Office",
        coords: { x: 23, y: 32 },
      },
      {
        id: "sp",
        name: "São Paulo",
        country: "Brazil",
        role: "Regional Office",
        coords: { x: 34, y: 65 },
      },
    ],
    europe: [
      {
        id: "ld",
        name: "London",
        country: "United Kingdom",
        role: "Regional Office",
        coords: { x: 47, y: 32 },
      },
      {
        id: "zu",
        name: "Zurich",
        country: "Switzerland",
        role: "Financial Hub",
        coords: { x: 49, y: 35 },
      },
      {
        id: "ct",
        name: "Cape Town",
        country: "South Africa",
        role: "Regional Office",
        coords: { x: 54, y: 68 },
      },
      {
        id: "db",
        name: "Dubai",
        country: "UAE",
        role: "Middle East Hub",
        coords: { x: 61, y: 44 },
      },
    ],
    asia: [
      {
        id: "sg",
        name: "Singapore",
        country: "Singapore",
        role: "Asian Headquarters",
        coords: { x: 76, y: 53 },
      },
      {
        id: "hk",
        name: "Hong Kong",
        country: "China",
        role: "Trading Hub",
        coords: { x: 78, y: 44 },
      },
      {
        id: "tk",
        name: "Tokyo",
        country: "Japan",
        role: "Regional Office",
        coords: { x: 85, y: 38 },
      },
      {
        id: "sy",
        name: "Sydney",
        country: "Australia",
        role: "Regional Office",
        coords: { x: 86, y: 70 },
      },
    ],
  };

  // Handle hovering or clicking on location
  const handleLocationHover = (region) => {
    setActiveRegion(region);
  };

  return (
    <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <div className="absolute inset-0 opacity-20 bg-blue-600"></div>

      {/* World Map SVG */}
      <div className="relative">
        <svg viewBox="0 0 100 80" className="w-full h-full">
          {/* Simplified world map */}
          <path
            d="M10,20 Q25,10 40,25 T90,30 Q95,40 85,50 T60,60 Q40,70 20,50 T10,20"
            fill="#1E40AF"
            opacity="0.4"
            stroke="#2563EB"
            strokeWidth="0.5"
          />

          {/* North America */}
          <path
            d="M5,15 Q15,10 20,25 T25,35 Q20,40 10,30 T5,15"
            fill="#1E40AF"
            opacity="0.6"
            stroke="#2563EB"
            strokeWidth="0.3"
          />

          {/* South America */}
          <path
            d="M25,45 Q30,40 35,50 T30,65 Q25,70 20,60 T25,45"
            fill="#1E40AF"
            opacity="0.6"
            stroke="#2563EB"
            strokeWidth="0.3"
          />

          {/* Europe */}
          <path
            d="M45,15 Q55,10 60,25 T55,35 Q50,40 40,30 T45,15"
            fill="#1E40AF"
            opacity="0.6"
            stroke="#2563EB"
            strokeWidth="0.3"
          />

          {/* Africa */}
          <path
            d="M45,35 Q55,30 60,45 T55,65 Q50,70 40,60 T45,35"
            fill="#1E40AF"
            opacity="0.6"
            stroke="#2563EB"
            strokeWidth="0.3"
          />

          {/* Asia */}
          <path
            d="M65,15 Q80,10 85,30 T80,50 Q70,60 60,45 T65,15"
            fill="#1E40AF"
            opacity="0.6"
            stroke="#2563EB"
            strokeWidth="0.3"
          />

          {/* Australia */}
          <path
            d="M80,55 Q90,50 95,65 T85,75 Q75,80 70,70 T80,55"
            fill="#1E40AF"
            opacity="0.6"
            stroke="#2563EB"
            strokeWidth="0.3"
          />

          {/* Location markers for Americas */}
          {officeLocations.americas.map((location) => (
            <g
              key={location.id}
              transform={`translate(${location.coords.x}, ${location.coords.y})`}
            >
              <circle
                r="0.8"
                fill={activeRegion === "americas" ? "#F59E0B" : "#FFFFFF"}
                stroke="#1E40AF"
                strokeWidth="0.2"
                opacity={activeRegion === "americas" ? 1 : 0.8}
                onMouseEnter={() => handleLocationHover("americas")}
                className="cursor-pointer transition-all duration-300"
              />
              <circle
                r="1.5"
                fill="transparent"
                stroke={activeRegion === "americas" ? "#F59E0B" : "#FFFFFF"}
                strokeWidth="0.2"
                opacity={activeRegion === "americas" ? 0.5 : 0.2}
                className="animate-ping-slow"
              />
            </g>
          ))}

          {/* Location markers for Europe/Africa */}
          {officeLocations.europe.map((location) => (
            <g
              key={location.id}
              transform={`translate(${location.coords.x}, ${location.coords.y})`}
            >
              <circle
                r="0.8"
                fill={activeRegion === "europe" ? "#F59E0B" : "#FFFFFF"}
                stroke="#1E40AF"
                strokeWidth="0.2"
                opacity={activeRegion === "europe" ? 1 : 0.8}
                onMouseEnter={() => handleLocationHover("europe")}
                className="cursor-pointer transition-all duration-300"
              />
              <circle
                r="1.5"
                fill="transparent"
                stroke={activeRegion === "europe" ? "#F59E0B" : "#FFFFFF"}
                strokeWidth="0.2"
                opacity={activeRegion === "europe" ? 0.5 : 0.2}
                className="animate-ping-slow"
              />
            </g>
          ))}

          {/* Location markers for Asia/Pacific */}
          {officeLocations.asia.map((location) => (
            <g
              key={location.id}
              transform={`translate(${location.coords.x}, ${location.coords.y})`}
            >
              <circle
                r="0.8"
                fill={activeRegion === "asia" ? "#F59E0B" : "#FFFFFF"}
                stroke="#1E40AF"
                strokeWidth="0.2"
                opacity={activeRegion === "asia" ? 1 : 0.8}
                onMouseEnter={() => handleLocationHover("asia")}
                className="cursor-pointer transition-all duration-300"
              />
              <circle
                r="1.5"
                fill="transparent"
                stroke={activeRegion === "asia" ? "#F59E0B" : "#FFFFFF"}
                strokeWidth="0.2"
                opacity={activeRegion === "asia" ? 0.5 : 0.2}
                className="animate-ping-slow"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Information overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent p-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                activeRegion === "americas"
                  ? "bg-blue-900"
                  : "bg-blue-900/50 hover:bg-blue-900/80"
              }`}
              onMouseEnter={() => handleLocationHover("americas")}
            >
              <h3 className="font-bold text-white">Americas</h3>
              <p className="text-blue-200 text-sm">3 Offices</p>
            </div>

            <div
              className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                activeRegion === "europe"
                  ? "bg-blue-900"
                  : "bg-blue-900/50 hover:bg-blue-900/80"
              }`}
              onMouseEnter={() => handleLocationHover("europe")}
            >
              <h3 className="font-bold text-white">Europe & Africa</h3>
              <p className="text-blue-200 text-sm">4 Offices</p>
            </div>

            <div
              className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                activeRegion === "asia"
                  ? "bg-blue-900"
                  : "bg-blue-900/50 hover:bg-blue-900/80"
              }`}
              onMouseEnter={() => handleLocationHover("asia")}
            >
              <h3 className="font-bold text-white">Asia-Pacific</h3>
              <p className="text-blue-200 text-sm">4 Offices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active region details */}
      {activeRegion && (
        <div className="absolute top-4 right-4 w-64 bg-blue-900/90 rounded-lg p-4 shadow-lg border border-blue-700">
          <h3 className="text-white font-bold mb-2">
            {activeRegion === "americas"
              ? "Americas"
              : activeRegion === "europe"
              ? "Europe & Africa"
              : "Asia-Pacific"}
          </h3>
          <ul className="space-y-2">
            {officeLocations[activeRegion].map((location) => (
              <li key={location.id} className="flex items-start text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 mr-2"></div>
                <div>
                  <span className="text-white font-medium">
                    {location.name}, {location.country}
                  </span>
                  <p className="text-blue-200 text-xs">{location.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats overlay */}
      <div className="absolute top-4 left-4 bg-blue-900/80 rounded-lg p-4 shadow-lg border border-blue-700">
        <h3 className="text-white font-bold mb-2">Global Network</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-blue-200">Countries</p>
            <p className="text-xl font-bold text-white">40+</p>
          </div>
          <div>
            <p className="text-xs text-blue-200">Offices</p>
            <p className="text-xl font-bold text-white">11</p>
          </div>
          <div>
            <p className="text-xs text-blue-200">Clients</p>
            <p className="text-xl font-bold text-white">10k+</p>
          </div>
          <div>
            <p className="text-xs text-blue-200">Assets</p>
            <p className="text-xl font-bold text-white">$10M+</p>
          </div>
        </div>
      </div>
    </div>
  );
}
