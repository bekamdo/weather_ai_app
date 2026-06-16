import { API_CONFIG } from "./config";
import type { WeatherData, ForecastData, GeocodingResponse, Coordinates } from "./types";

// Maps WMO weather code to OpenWeatherMap-compatible icon + description
function wmoToCondition(code: number): { id: number; main: string; description: string; icon: string } {
  const map: Record<number, { main: string; description: string; icon: string }> = {
    0:  { main: "Clear",       description: "clear sky",           icon: "01d" },
    1:  { main: "Clear",       description: "mainly clear",        icon: "01d" },
    2:  { main: "Clouds",      description: "partly cloudy",       icon: "02d" },
    3:  { main: "Clouds",      description: "overcast",            icon: "04d" },
    45: { main: "Fog",         description: "fog",                 icon: "50d" },
    48: { main: "Fog",         description: "icy fog",             icon: "50d" },
    51: { main: "Drizzle",     description: "light drizzle",       icon: "09d" },
    53: { main: "Drizzle",     description: "drizzle",             icon: "09d" },
    55: { main: "Drizzle",     description: "heavy drizzle",       icon: "09d" },
    61: { main: "Rain",        description: "light rain",          icon: "10d" },
    63: { main: "Rain",        description: "rain",                icon: "10d" },
    65: { main: "Rain",        description: "heavy rain",          icon: "10d" },
    71: { main: "Snow",        description: "light snow",          icon: "13d" },
    73: { main: "Snow",        description: "snow",                icon: "13d" },
    75: { main: "Snow",        description: "heavy snow",          icon: "13d" },
    80: { main: "Rain",        description: "rain showers",        icon: "09d" },
    81: { main: "Rain",        description: "showers",             icon: "09d" },
    82: { main: "Rain",        description: "heavy showers",       icon: "09d" },
    95: { main: "Thunderstorm",description: "thunderstorm",        icon: "11d" },
    96: { main: "Thunderstorm",description: "thunderstorm w/ hail",icon: "11d" },
    99: { main: "Thunderstorm",description: "thunderstorm w/ hail",icon: "11d" },
  };
  const match = map[code] ?? { main: "Unknown", description: "unknown", icon: "01d" };
  return { id: code, ...match };
}

class WeatherAPI {
  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }

  async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,precipitation",
      daily: "temperature_2m_max,temperature_2m_min,sunrise,sunset",
      timezone: "auto",
    });
    const raw = await this.fetchData<any>(`${API_CONFIG.BASE_URL}/forecast?${params}`);
    const c = raw.current;
    const d = raw.daily;
    const condition = wmoToCondition(c.weather_code);
    return {
      coord: { lat, lon },
      weather: [condition],
      main: {
        temp: c.temperature_2m,
        feels_like: c.apparent_temperature,
        temp_min: d.temperature_2m_min[0],
        temp_max: d.temperature_2m_max[0],
        pressure: 1013,
        humidity: c.relative_humidity_2m,
      },
      wind: { speed: c.wind_speed_10m / 3.6, deg: 0 },
      sys: {
        sunrise: new Date(d.sunrise[0]).getTime() / 1000,
        sunset: new Date(d.sunset[0]).getTime() / 1000,
        country: "",
      },
      name: "",
      dt: new Date(c.time).getTime() / 1000,
    };
  }

  async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      hourly: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m",
      daily: "sunrise,sunset",
      timezone: "auto",
      forecast_days: "5",
    });
    const raw = await this.fetchData<any>(`${API_CONFIG.BASE_URL}/forecast?${params}`);
    const h = raw.hourly;
    const list = h.time.map((time: string, i: number) => {
      const condition = wmoToCondition(h.weather_code[i]);
      return {
        dt: new Date(time).getTime() / 1000,
        main: {
          temp: h.temperature_2m[i],
          feels_like: h.apparent_temperature[i],
          temp_min: h.temperature_2m[i],
          temp_max: h.temperature_2m[i],
          pressure: 1013,
          humidity: h.relative_humidity_2m[i],
        },
        weather: [condition],
        wind: { speed: h.wind_speed_10m[i] / 3.6, deg: 0 },
        dt_txt: time,
      };
    });
    return {
      list,
      city: { name: "", country: "", sunrise: 0, sunset: 0 },
    };
  }

  async reverseGeocode({ lat, lon }: Coordinates): Promise<GeocodingResponse[]> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      localityLanguage: "en",
    });
    const raw = await this.fetchData<any>(`${API_CONFIG.REVERSE_GEO}/reverse-geocode-client?${params}`);
    return [{
      name: raw.city || raw.locality || raw.principalSubdivision || `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      lat,
      lon,
      country: raw.countryCode ?? "",
      state: raw.principalSubdivision || undefined,
    }];
  }

  async searchLocations(query: string): Promise<GeocodingResponse[]> {
    const params = new URLSearchParams({ name: query, count: "5", language: "en", format: "json" });
    const raw = await this.fetchData<any>(`${API_CONFIG.GEO}/search?${params}`);
    return (raw.results ?? []).map((r: any) => ({
      name: r.name,
      lat: r.latitude,
      lon: r.longitude,
      country: r.country_code?.toUpperCase() ?? "",
      state: r.admin1,
    }));
  }
}

export const weatherAPI = new WeatherAPI();
