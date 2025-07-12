import { Cloud, Droplets, Wind, Thermometer, Sun } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export const WeatherCard = () => {
  // Mock weather data - in real app this would come from weather API
  const weatherData = {
    temperature: 28,
    condition: "आंशिक बादल",
    humidity: 65,
    windSpeed: 12,
    rainfall: 2.5,
    uvIndex: 6,
    location: "बेंगलुरु, कर्नाटक"
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">आज का मौसम</h2>
      <Card className="p-4 bg-gradient-sky text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">{weatherData.temperature}°C</h3>
            <p className="text-sm opacity-90">{weatherData.condition}</p>
            <p className="text-xs opacity-75">{weatherData.location}</p>
          </div>
          <Cloud className="h-12 w-12 opacity-80" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/20">
          <div className="text-center">
            <Droplets className="h-4 w-4 mx-auto mb-1" />
            <p className="text-xs opacity-90">नमी</p>
            <p className="text-sm font-medium">{weatherData.humidity}%</p>
          </div>
          <div className="text-center">
            <Wind className="h-4 w-4 mx-auto mb-1" />
            <p className="text-xs opacity-90">हवा</p>
            <p className="text-sm font-medium">{weatherData.windSpeed} km/h</p>
          </div>
          <div className="text-center">
            <Sun className="h-4 w-4 mx-auto mb-1" />
            <p className="text-xs opacity-90">UV Index</p>
            <p className="text-sm font-medium">{weatherData.uvIndex}</p>
          </div>
        </div>
        
        {weatherData.rainfall > 0 && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <Badge variant="secondary" className="bg-white/20 text-white">
              🌧️ बारिश की संभावना: {weatherData.rainfall}mm
            </Badge>
          </div>
        )}
      </Card>
    </div>
  );
};