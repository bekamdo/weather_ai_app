import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sparkles } from "lucide-react";
import { getWeatherInsights } from "@/api/gemini";
import type { WeatherData, ForecastData } from "@/api/types";
import { Skeleton } from "./ui/skeleton";

interface WeatherInsightsProps {
  weather: WeatherData;
  forecast: ForecastData;
  locationName: string;
}

export function WeatherInsights({ weather, forecast, locationName }: WeatherInsightsProps) {
  const { data: insight, isLoading, error } = useQuery({
    queryKey: ["gemini-insight", weather.dt, locationName],
    queryFn: () => getWeatherInsights(weather, forecast, locationName),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    retryDelay: 45000,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          AI Weather Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        )}
        {error && (
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Unable to load AI insights at the moment."}
          </p>
        )}
        {insight && (
          <p className="text-sm leading-relaxed text-muted-foreground">{insight}</p>
        )}
      </CardContent>
    </Card>
  );
}
