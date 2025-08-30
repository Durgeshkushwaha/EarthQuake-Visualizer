// src/App.jsx
import React, { useState } from "react";
import MapView from "./components/MapView.jsx";
import Sidebar from "./components/Sidebar.jsx";
import useEarthquakes from "./hooks/useEarthquakes.js";

export default function App() {
  // time range: "hour" | "day" | "week"
  const [range, setRange] = useState("day");
  const [selected, setSelected] = useState(null); // 👈 new state
  const [filters, setFilters] = useState({
    minMag: 0,
    query: "", // text search by place
  });
  const [showHeatmap, setShowHeatmap] = useState(false);

  const { data, loading, error, refetch } = useEarthquakes(range);

  // apply filters client-side
  const filtered = React.useMemo(() => {
    if (!data?.features) return [];
    return data.features.filter((f) => {
      const mag = f.properties?.mag ?? 0;
      const place = (f.properties?.place || "").toLowerCase();
      const okMag = mag >= filters.minMag;
      const okQuery = filters.query
        ? place.includes(filters.query.toLowerCase())
        : true;
      return okMag && okQuery;
    });
  }, [data, filters]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-800 text-white shadow-lg flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white/10 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Earthquake Visualizer
            </h1>
            <p className="text-sm text-blue-100 opacity-90">Last {range} • Real-time seismic data</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-white/10 rounded-lg px-3 py-1.5 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last updated: {new Date().toLocaleTimeString()}
          </div>

          <button
            onClick={refetch}
            className="flex items-center bg-white text-blue-900 hover:bg-blue-50 transition-colors text-sm font-medium px-4 py-2 rounded-lg border border-white/20 shadow-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
      </header>
      <hr className="bg-gray-800 "></hr>
      

      <main className="flex-1 grid grid-cols-1 md:grid-cols-[360px_1fr]">
        <Sidebar
          loading={loading}
          error={error}
          filters={filters}
          setFilters={setFilters}
          features={filtered}
          range={range}
          setRange={setRange}
          showHeatmap={showHeatmap}
          setShowHeatmap={setShowHeatmap}
          onSelect={setSelected} // 👈 set selected when sidebar item clicked
        />
        <MapView
          loading={loading}
          features={filtered}
          showHeatmap={showHeatmap}
          selected={selected} // 👈 pass to map
        />
      </main>

      {/* <footer className="px-4 py-2 text-xs text-gray-500 bg-white border-t">
        Data: USGS. Map © OpenStreetMap contributors. Heatmap uses magnitude as intensity.
      </footer> */}
    </div>
  );
}
