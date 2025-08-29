// src/components/MapView.jsx
import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { formatDateTime } from "../utils/format.js";

// Helper: create a colored marker
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

// Different icons for magnitude
const quakeIcons = {
  green: createIcon("green"),
  yellow: createIcon("gold"),
  red: createIcon("red"),
};

/** Fit map to all markers */
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points?.length) return;
    const bounds = L.latLngBounds(points.map((p) => [p[1], p[0]]));
    try {
      map.fitBounds(bounds.pad(0.2), { animate: true });
    } catch {
      // ignore
    }
  }, [points, map]);
  return null;
}

function FlyToFeature({ feature }) {
  const map = useMap();
  useEffect(() => {
    if (!feature?.geometry?.coordinates) return;
    const [lon, lat] = feature.geometry.coordinates;
    map.flyTo([lat, lon], 6, { animate: true });
  }, [feature, map]);
  return null;
}




// Legend control component


function LegendControl() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create(
        "div",
        "info legend bg-white p-2 rounded-lg shadow text-sm cursor-move"
      );
      div.innerHTML = `
        <h4 style="margin:2px 0 6px;font-weight:600;">Magnitude</h4>
        <div><span style="background:green; width:12px; height:12px; display:inline-block; margin-right:6px;"></span> < 4.0</div>
        <div><span style="background:gold; width:12px; height:12px; display:inline-block; margin-right:6px;"></span> 4.0 – 5.9</div>
        <div><span style="background:red; width:12px; height:12px; display:inline-block; margin-right:6px;"></span> ≥ 6.0</div>
      `;

      // ✅ Make draggable
      let isDragging = false;
      let offset = [0, 0];

      div.addEventListener("mousedown", (e) => {
        isDragging = true;
        offset = [
          e.clientX - div.getBoundingClientRect().left,
          e.clientY - div.getBoundingClientRect().top,
        ];
        div.style.position = "absolute";
        div.style.zIndex = 1000;
        document.body.appendChild(div);
      });

      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        div.style.left = e.clientX - offset[0] + "px";
        div.style.top = e.clientY - offset[1] + "px";
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
      });

      return div;
    };

    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}




 

/** Single Earthquake marker with auto-popup if selected */
function EarthquakeMarker({ feature, isSelected }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup(); // auto-open popup
    }
  }, [isSelected]);

  if (!feature?.geometry?.coordinates) return null;

  const [lon, lat, depth] = feature.geometry.coordinates;
  const mag = feature.properties?.mag ?? 0;
  const place = feature.properties?.place || "Unknown location";
  const time = feature.properties?.time ? new Date(feature.properties.time) : null;
  const url = feature.properties?.url;

  // Choose marker color based on magnitude
  let icon = quakeIcons.green;
  if (mag >= 6) {
    icon = quakeIcons.red;
  } else if (mag >= 4) {
    icon = quakeIcons.yellow;
  }

  return (
    <Marker ref={markerRef} position={[lat, lon]} icon={icon}>
      <Popup>
        <div className="text-sm">
          <div className="font-semibold mb-1">{place}</div>
          <div>
            Magnitude: <span className="font-medium">{mag}</span>
          </div>
          {Number.isFinite(depth) && <div>Depth: {depth} km</div>}
          {time && <div>Time: {formatDateTime(time)}</div>}
          {url && (
            <a
              className="text-blue-600 underline"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              USGS Event Page →
            </a>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapView({ loading, features, showHeatmap = false, selected }) {
  const coords = useMemo(() => {
    return features
      .map((f) => f.geometry?.coordinates)
      .filter((c) => Array.isArray(c) && c.length >= 2);
  }, [features]);

  return (
    <div className="relative">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        className="h-[calc(100vh-96px)] w-full"
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {!loading &&
          features.map((f) => (
            <EarthquakeMarker
              key={f.id}
              feature={f}
              isSelected={selected?.id === f.id}
            />
          ))}

        <FitBounds points={coords} />
        {selected && <FlyToFeature feature={selected} />}
         <LegendControl />   {/* ✅ New legend */}
      </MapContainer>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="animate-pulse text-gray-700 font-medium">
            Loading earthquakes…
          </div>
        </div>
      )}
    </div>
  );
}
