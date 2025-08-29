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
      <header className="px-4 py-3 bg-white border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          🌍 Earthquake Visualizer — Last {range}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
            className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </header>

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

      <footer className="px-4 py-2 text-xs text-gray-500 bg-white border-t">
        Data: USGS. Map © OpenStreetMap contributors. Heatmap uses magnitude as intensity.
      </footer>
    </div>
  );
}
