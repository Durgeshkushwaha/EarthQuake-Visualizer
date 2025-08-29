// src/components/Sidebar.jsx
import React, { useMemo, useState } from "react";
import { formatDateTime } from "../utils/format.js";
import classNames from "classnames";

function Stat({ label, value }) {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="text-xs font-medium text-gray-300 uppercase tracking-wide">{label}</div>
      <div className="text-xl font-bold text-gray-100 mt-1">{value}</div>
    </div>
  );
}

export default function Sidebar({
  loading,
  error,
  filters,
  setFilters,
  features,
  range,
  setRange,
  showHeatmap,
  setShowHeatmap,
  onSelect,
}) {
  const [open, setOpen] = useState(true);

  const stats = useMemo(() => {
    if (!features?.length) return { count: 0, maxMag: "-", avgMag: "-" };
    const mags = features.map((f) => f.properties?.mag ?? 0).filter((m) => Number.isFinite(m));
    const count = features.length;
    const maxMag = mags.length ? Math.max(...mags).toFixed(1) : "-";
    const avgMag = mags.length ? (mags.reduce((a, b) => a + b, 0) / mags.length).toFixed(2) : "-";
    return { count, maxMag, avgMag };
  }, [features]);

  return (
    <aside className={classNames("bg-gradient-to-b from-indigo-900 to-blue-800 border-r border-gray-700/50 backdrop-blur-sm", { "h-[calc(100vh-96px)] overflow-y-auto": true })}>
      {/* Mobile toggle */}
      <div className="md:hidden p-4 border-b border-gray-700/50 bg-gray-800/90 backdrop-blur-sm flex items-center justify-between shadow-sm">
        <div className="font-semibold text-gray-100">Filters & List</div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-sm px-4 py-2 rounded-xl border border-gray-600 bg-gray-700/70 hover:bg-gray-700 font-medium text-gray-100 transition-all duration-200 hover:shadow-sm"
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>

      <div className={classNames("p-6 space-y-6", { hidden: !open && "md:block" })}>
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-gray-100 uppercase tracking-wider flex items-center">
            <div className="w-1 h-4 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full mr-3"></div>
            Range & Display
          </h2>

          <div className="p-5 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-sm space-y-4">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide">Time Range</label>
            <div className="flex gap-2">
              <button
                onClick={() => setRange("hour")}
                className={classNames("px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200", {
                  "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/25": range === "hour",
                  "bg-gray-700/70 text-gray-200 border-gray-600 hover:bg-gray-700 hover:shadow-sm": range !== "hour",
                })}
              >
                Hour
              </button>
              <button
                onClick={() => setRange("day")}
                className={classNames("px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200", {
                  "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/25": range === "day",
                  "bg-gray-700/70 text-gray-200 border-gray-600 hover:bg-gray-700 hover:shadow-sm": range !== "day",
                })}
              >
                Day
              </button>
              <button
                onClick={() => setRange("week")}
                className={classNames("px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200", {
                  "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/25": range === "week",
                  "bg-gray-700/70 text-gray-200 border-gray-600 hover:bg-gray-700 hover:shadow-sm": range !== "week",
                })}
              >
                Week
              </button>
            </div>

            {/* <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
              />
              <span>Show magnitude heatmap</span>
            </label> */}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-gray-100 uppercase tracking-wider flex items-center">
            <div className="w-1 h-4 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full mr-3"></div>
            Filters
          </h2>
          <div className="space-y-4 p-5 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-3">Minimum Magnitude</label>
              <div className="relative">
                <input
                  type="range"
                  min={0}
                  max={7}
                  step={0.1}
                  value={filters.minMag}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, minMag: Number(e.target.value) }))
                  }
                  className="w-full h-2 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #4f46e5 0%, #7c3aed ${(filters.minMag / 7) * 100}%, #374151 ${(filters.minMag / 7) * 100}%, #374151 100%)`
                  }}
                />
              </div>
              <div className="text-sm mt-2 flex justify-between items-center">
                <span className="text-gray-300">Current:</span>
                <span className="font-bold text-gray-100 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">{filters.minMag}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-3">Search by Place/Region</label>
              <input
                type="text"
                placeholder="e.g., Alaska, Japan"
                value={filters.query}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, query: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-600 bg-gray-700/50 px-4 py-3 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-200"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-gray-100 uppercase tracking-wider flex items-center">
            <div className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full mr-3"></div>
            Stats
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Total" value={stats.count} />
            <Stat label="Max M" value={stats.maxMag} />
            <Stat label="Avg M" value={stats.avgMag} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-gray-100 uppercase tracking-wider flex items-center">
            <div className="w-1 h-4 bg-gradient-to-b from-rose-400 to-pink-500 rounded-full mr-3"></div>
            Earthquakes
          </h2>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-sm">
            {error && (
              <div className="p-4 text-sm text-red-300 bg-red-900/30 border-b border-red-800/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  Couldn't load data. Check your connection and try Refresh.
                </div>
              </div>
            )}
            {!error && !loading && features.length === 0 && (
              <div className="p-4 text-sm text-gray-400 bg-gray-800/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  No earthquakes matched your filters.
                </div>
              </div>
            )}
            <ul className="max-h-[48vh] overflow-y-auto divide-y divide-gray-700/50">
              {features.map((f) => {
                const { mag, place, time } = f.properties || {};
                return (
                  <li
                    key={f.id}
                    className="p-4 text-sm cursor-pointer hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-800/30 transition-all duration-200 group"
                    onClick={() => onSelect?.(f)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-gray-100 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-purple-400">
                        M{mag?.toFixed?.(1) ?? mag ?? "?"}
                      </div>
                      <div className="text-xs font-medium text-gray-400 bg-gray-700/60 px-2 py-1 rounded-full">
                        {time ? formatDateTime(new Date(time)) : "—"}
                      </div>
                    </div>
                    <div className="text-gray-200 font-medium leading-relaxed">{place || "Unknown location"}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <div className="p-4 bg-gradient-to-r from-gray-800/60 to-gray-700/40 rounded-2xl border border-gray-600/50">
          <p className="text-xs text-gray-300 leading-relaxed">
            <span className="font-semibold text-indigo-400">💡 Tip:</span> Turn on heatmap to view density (magnitude-weighted), and switch ranges to compare.
          </p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #4f46e5, #7c3aed);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #4f46e5, #7c3aed);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
        }
      `}</style>
    </aside>
  );
}