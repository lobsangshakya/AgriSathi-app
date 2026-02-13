import { Cloud, Droplets, Wind, Thermometer, Sun, MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export const WeatherCard = () => {
  const { t, language } = useLanguage();

  // Mock weather data - in real app this would come from weather API
  const weatherData = {
    temperature: 28,
    condition: language === 'hindi' ? "आंशिक बादल" : "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    rainfall: 2.5,
    uvIndex: 6,
    location: language === 'hindi' ? "बेंगलुरु, कर्नाटक" : "Bangalore, Karnataka",
    feelsLike: 30,
    high: 32,
    low: 24,
    pressure: 1013,
    visibility: 10
  };

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('बादल') || condition.includes('Cloud')) return '';
    if (condition.includes('बारिश') || condition.includes('Rain')) return '';
    if (condition.includes('धूप') || condition.includes('Sun')) return '';
    if (condition.includes('कोहरा') || condition.includes('Fog')) return '';
    return '';
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: 'bg-green-500' };
    if (uv <= 5) return { level: 'Moderate', color: 'bg-yellow-500' };
    if (uv <= 7) return { level: 'High', color: 'bg-orange-500' };
    return { level: 'Very High', color: 'bg-red-500' };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full p-2">
          <Cloud className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gradient">
            {t('weather.today') || 'Today\'s Weather'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('weather.subtitle') || 'Plan your farming activities'}
          </p>
        </div>
      </div>

      {/* Main Weather Card */}
      <Card className="card-enhanced overflow-hidden group hover-scale transition-all duration-300">
        <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 p-6 text-white relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-300 rounded-full blur-2xl" />
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <MapPin className="h-4 w-4 text-cyan-200" />
            <span className="text-sm text-cyan-100">{weatherData.location}</span>
          </div>
          
          {/* Main Weather Info */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <h2 className="text-4xl font-bold">{weatherData.temperature}°</h2>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-300" />
                  <span className="text-cyan-100">{weatherData.high}°</span>
                  <TrendingDown className="h-3 w-3 text-blue-300" />
                  <span className="text-cyan-100">{weatherData.low}°</span>
                </div>
              </div>
              <p className="text-lg font-medium text-cyan-100 mb-1">
                {weatherData.condition}
              </p>
              <p className="text-sm text-cyan-200">
                {t('weather.feelsLike') || 'Feels like'} {weatherData.feelsLike}°
              </p>
            </div>
            
            <div className="text-6xl animate-float">
              {getWeatherIcon(weatherData.condition)}
            </div>
          </div>
          
          {/* Weather Stats */}
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Droplets className="h-5 w-5 mx-auto mb-2 text-cyan-200" />
              <p className="text-xs text-cyan-200 mb-1">{t('weather.humidity') || 'Humidity'}</p>
              <p className="text-lg font-bold">{weatherData.humidity}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Wind className="h-5 w-5 mx-auto mb-2 text-cyan-200" />
              <p className="text-xs text-cyan-200 mb-1">{t('weather.wind') || 'Wind'}</p>
              <p className="text-lg font-bold">{weatherData.windSpeed} km/h</p>
            </div>
          </div>
        </div>
        
        {/* Additional Weather Details */}
        <div className="p-6 space-y-4">
          {/* UV Index */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">{t('weather.uvIndex') || 'UV Index'}</p>
                <p className="text-xs text-muted-foreground">
                  {getUVLevel(weatherData.uvIndex).level} risk
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{weatherData.uvIndex}</span>
              <div className={`w-3 h-3 rounded-full ${getUVLevel(weatherData.uvIndex).color}`} />
            </div>
          </div>
          
          {/* Rainfall */}
          {weatherData.rainfall > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl"></div>
                <div>
                  <p className="text-sm font-medium">{t('weather.rainChance') || 'Rainfall'}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('weather.rainDesc') || 'Expected today'}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {weatherData.rainfall} mm
              </Badge>
            </div>
          )}
          
          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{t('weather.pressure') || 'Pressure'}</p>
              <p className="text-sm font-medium">{weatherData.pressure} hPa</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{t('weather.visibility') || 'Visibility'}</p>
              <p className="text-sm font-medium">{weatherData.visibility} km</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Weather Alert */}
      {weatherData.rainfall > 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 p-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="text-2xl"></div>
            <div>
              <p className="text-sm font-medium text-orange-800">
                {t('weather.rainAlert') || 'Rain Alert'}
              </p>
              <p className="text-xs text-orange-600">
                {t('weather.rainAlertDesc') || 'Plan irrigation accordingly'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};