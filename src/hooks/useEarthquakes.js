// src/hooks/useEarthquakes.js
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Fetches earthquakes from USGS for the selected time range.
 * range: "hour" | "day" | "week"
 */
const FEEDS = {
  hour: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
  day:  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
  week: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
};

export default function useEarthquakes(range = "day") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  const fetchData = useCallback(async (selectedRange = range) => {
    setLoading(true);
    setError("");
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const url = FEEDS[selectedRange] || FEEDS.day;

    try {
      const res = await fetch(url, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(e.message || "Failed to load");
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [range]);

  // fetch on mount and when range changes
  useEffect(() => {
    fetchData(range);
    const id = setInterval(() => fetchData(range), 5 * 60 * 1000); // refresh every 5 min
    return () => {
      clearInterval(id);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchData, range]);

  return { data, loading, error, refetch: () => fetchData(range) };
}
