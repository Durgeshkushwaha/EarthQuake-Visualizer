export function pad2(v) {
  return String(v).padStart(2, "0");
}

// Formats like: 2025-08-28 14:37 UTC (or your local)
export function formatDateTime(d) {
  // show local time for Casey; append local TZ short
  try {
    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    const hh = pad2(d.getHours());
    const mm = pad2(d.getMinutes());
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
    return `${y}-${m}-${day} ${hh}:${mm} (${tz})`;
  } catch {
    return d?.toString?.() || "—";
  }
}
