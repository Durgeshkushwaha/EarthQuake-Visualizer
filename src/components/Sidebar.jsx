// src/components/Sidebar.jsx
import React, { useMemo, useState } from "react";
import { formatDateTime } from "../utils/format.js";
import classNames from "classnames";

function Stat({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-white border">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
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
  onSelect, // 👈 add new prop
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
    <aside className={classNames("bg-gray-100 border-r", { "h-[calc(100vh-96px)] overflow-y-auto": true })}>
      {/* Mobile toggle */}
      <div className="md:hidden p-2 border-b bg-white flex items-center justify-between">
        <div className="font-medium">Filters & List</div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-sm px-2 py-1 rounded-lg border"
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>

      <div className={classNames("p-4 space-y-4", { hidden: !open && "md:block" })}>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Range & Display</h2>

          <div className="p-3 rounded-xl bg-white border space-y-3">
            <label className="block text-xs text-gray-600">Time Range</label>
            <div className="flex gap-2">
              <button
                onClick={() => setRange("hour")}
                className={classNames("px-3 py-1 rounded-lg text-sm border", {
                  "bg-blue-600 text-white": range === "hour",
                })}
              >
                Hour
              </button>
              <button
                onClick={() => setRange("day")}
                className={classNames("px-3 py-1 rounded-lg text-sm border", {
                  "bg-blue-600 text-white": range === "day",
                })}
              >
                Day
              </button>
              <button
                onClick={() => setRange("week")}
                className={classNames("px-3 py-1 rounded-lg text-sm border", {
                  "bg-blue-600 text-white": range === "week",
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

        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Filters</h2>
          <div className="space-y-2 p-3 rounded-xl bg-white border">
            <label className="block text-xs text-gray-600 mb-1">Minimum Magnitude</label>
            <input
              type="range"
              min={0}
              max={7}
              step={0.1}
              value={filters.minMag}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minMag: Number(e.target.value) }))
              }
              className="w-full"
            />
            <div className="text-xs">Current: <span className="font-medium">{filters.minMag}</span></div>

            <label className="block text-xs text-gray-600 mt-3 mb-1">Search by Place/Region</label>
            <input
              type="text"
              placeholder="e.g., Alaska, Japan"
              value={filters.query}
              onChange={(e) =>
                setFilters((f) => ({ ...f, query: e.target.value }))
              }
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Stats</h2>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Total" value={stats.count} />
            <Stat label="Max M" value={stats.maxMag} />
            <Stat label="Avg M" value={stats.avgMag} />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Earthquakes</h2>
          <div className="bg-white border rounded-xl overflow-hidden">
            {error && (
              <div className="p-3 text-sm text-red-600">
                Couldn’t load data. Check your connection and try Refresh.
              </div>
            )}
            {!error && !loading && features.length === 0 && (
              <div className="p-3 text-sm text-gray-600">No earthquakes matched your filters.</div>
            )}
            <ul className="max-h-[48vh] overflow-y-auto divide-y">
              {features.map((f) => {
                const { mag, place, time } = f.properties || {};
                return (
                  <li
                    key={f.id}
                    className="p-3 text-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => onSelect?.(f)} // 👈 call onSelect if provided
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        M{mag?.toFixed?.(1) ?? mag ?? "?"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {time ? formatDateTime(new Date(time)) : "—"}
                      </div>
                    </div>
                    <div className="text-gray-700">{place || "Unknown location"}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <p className="text-xs text-gray-500">
          Tip: Turn on heatmap to view density (magnitude-weighted), and switch ranges to compare.
        </p>
      </div>
    </aside>
  );
}
