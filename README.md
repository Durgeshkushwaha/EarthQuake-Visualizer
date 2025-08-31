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

Open in browser

http://localhost:5173


<img width="1919" height="1019" alt="image" src="https://github.com/user-attachments/assets/45f78b4c-74ad-4c02-90cd-646a7017e713" />


<img width="1919" height="1019" alt="Screenshot 2025-08-31 150422" src="https://github.com/user-attachments/assets/c85cfcd6-b427-4e1b-b8bc-374c058ee2a7" />
