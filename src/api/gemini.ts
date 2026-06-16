import { GoogleGenAI } from "@google/genai";
import type { WeatherData, ForecastData } from "./types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function getWeatherInsights(
  weather: WeatherData,
  forecast: ForecastData,
  locationName: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_new_key_here") {
    throw new Error("Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in .env.local");
  }

  const prompt = `
You are a helpful weather assistant. Based on the following weather data for ${locationName}, provide a brief, friendly, and practical weather insight in 3-4 sentences. Include:
- A summary of current conditions
- How it will feel outside
- A practical recommendation (clothing, activities, or health tips)

Current Weather:
- Temperature: ${Math.round(weather.main.temp)}°C (feels like ${Math.round(weather.main.feels_like)}°C)
- Condition: ${weather.weather[0].description}
- Humidity: ${weather.main.humidity}%
- Wind Speed: ${weather.wind.speed.toFixed(1)} m/s
- Min/Max: ${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C

Upcoming forecast summary (next 24h):
${forecast.list
  .slice(0, 8)
  .map((f) => `- ${f.dt_txt}: ${Math.round(f.main.temp)}°C, ${f.weather[0].description}`)
  .join("\n")}

Keep your response concise, warm, and conversational. Do not use markdown or bullet points.
  `.trim();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text ?? "";
}
