# ⚡ Weather AI

A modern, real-time weather application built with React, TypeScript, and Vite. Weather AI uses your live GPS location to display current conditions, hourly temperature charts, a 5-day forecast, and detailed weather metrics — all powered by free, keyless APIs.

---

## 📸 Features

- **Real-time geolocation** — Uses the browser's `watchPosition` API to continuously track your location and update weather data dynamically
- **Current weather** — Displays temperature, feels like, min/max, humidity, and wind speed
- **Hourly temperature chart** — Interactive line chart showing temperature and feels-like for the next 8 hours using Recharts
- **5-day forecast** — Daily min/max temperatures, wind speed, humidity, and weather description
- **Weather details** — Sunrise, sunset, wind direction, and atmospheric pressure
- **City search** — Search for any city worldwide with autocomplete, recent search history, and favorites
- **Favorite cities** — Save and quickly access your favorite locations
- **Dark / Light theme** — Fully themed UI with a persistent theme toggle
- **Fully responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Data Fetching | TanStack React Query v5 |
| Routing | React Router DOM v7 |
| Charts | Recharts |
| Icons | Lucide React |
| Date Formatting | date-fns |
| Notifications | Sonner |

---

## 🌐 APIs Used

All APIs are **free and require no API key**.

| API | Purpose |
|---|---|
| [Open-Meteo](https://open-meteo.com/) | Current weather & 5-day hourly forecast |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City search by name |
| [BigDataCloud](https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api) | Reverse geocoding (lat/lon → city name) |

---

## 📁 Project Structure

```
src/
├── api/
│   ├── config.tsx          # API base URLs
│   ├── types.tsx           # TypeScript interfaces
│   └── weather.tsx         # API class (weather, forecast, geocoding)
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── current-weather.tsx # Current conditions card
│   ├── hourly-temprature.tsx # Hourly chart
│   ├── weather-forecast.tsx  # 5-day forecast
│   ├── weather-details.tsx   # Sunrise/sunset/pressure/wind
│   ├── city-search.tsx     # Search with history & favorites
│   ├── favorite-button.tsx # Toggle favorite for a city
│   ├── favorite-cities.tsx # Favorite cities list
│   ├── header.tsx          # App header with search & theme toggle
│   ├── layout.tsx          # Page layout wrapper
│   ├── loading-skeleton.tsx # Loading state UI
│   └── theme-toggle.tsx    # Dark/light mode toggle
├── context/
│   └── theme-provider.tsx  # Global theme context
├── hooks/
│   ├── use-geolocation.ts  # Real-time GPS tracking
│   ├── use-weather.ts      # React Query hooks for weather data
│   ├── use-favorite.ts     # Favorites CRUD via local storage
│   ├── use-search-history.ts # Search history via local storage
│   └── use-local-storage.ts  # Generic local storage hook
├── pages/
│   ├── weather-dashboard.tsx # Home page (uses live location)
│   └── city-page.tsx         # City detail page (from search)
├── App.tsx                 # Root component, routing & providers
└── main.tsx                # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd weather_app

# Install dependencies
npm install
```

### Running the App

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** The app will request browser location permission on first load. Allow it to see your local weather.

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 🗺️ Routes

| Route | Description |
|---|---|
| `/` | Weather dashboard using your live GPS location |
| `/city/:cityName?lat=&lon=` | Weather detail page for a searched city |

---

## 💾 Local Storage

The app persists the following data in `localStorage`:

| Key | Description |
|---|---|
| `vite-ui-theme` | Current theme preference (`dark` / `light` / `system`) |
| `favorites` | List of saved favorite cities |
| `search-history` | Recent city searches |

---

## ⚙️ Key Implementation Details

### Real-time Location
`use-geolocation.ts` uses `navigator.geolocation.watchPosition` instead of `getCurrentPosition`, so the dashboard automatically updates as your physical location changes. The watcher is cleaned up on component unmount.

### Weather Data Mapping
Open-Meteo uses WMO weather codes instead of OpenWeatherMap-style conditions. The `wmoToCondition()` function in `weather.tsx` maps these codes to icon identifiers (served from `openweathermap.org/img/wn/`) and human-readable descriptions.

### Caching Strategy
React Query is configured with:
- `staleTime: 5 minutes` — data is considered fresh for 5 minutes
- `gcTime: 10 minutes` — cached data is garbage collected after 10 minutes
- `refetchOnWindowFocus: false` — no automatic refetch when switching tabs

---

## 📄 License

MIT © Ben Kamau
