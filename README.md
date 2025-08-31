# 🌍 Earthquake Visualizer

An interactive web application that visualizes **real-time earthquake activity** worldwide using the [USGS Earthquake API](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojso).  
Built with **React, Leaflet, and Tailwind CSS**, this project helps geography students and researchers better understand seismic patterns.

---

## ✨ Features

- 📡 **Live Earthquake Data** – fetches the latest earthquakes from USGS.
- 🗺️ **Interactive World Map** – earthquakes shown as markers with popups.
- 🔎 **List & Map Integration** – click an earthquake from the list to zoom into its location on the map.
- ⏳ **Date Range Filters** - (hour, day, week).
- 🎚️ **Magnitude Filters** - (small(green), medium(yellow), strong(red) earthquakes).
- 🎥 **Smooth Fly-To Animation** – zooms out → flies → zooms in to the new earthquake location.
- 💬 **Auto-Open Popups** – details appear immediately when a location is selected.
- 🎨 **Responsive UI** – works on desktop & mobile.
- 🧩 **Draggable Legend** – reposition the legend anywhere on the map.
- ⚠️ **Error Handling** – handles API/network failures gracefully.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/)  
- **Map Library**: [React-Leaflet](https://react-leaflet.js.org/)  
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)  
- **Data API**: [USGS Earthquake API](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson)  
- **State Management**: React Hooks & Context  

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Durgeshkushwaha/EarthQuake-Visualizer.git
cd earthquake-visualizer


Install dependencies

npm install

Run the development server

npm run dev

Open in browser - http://localhost:5173
