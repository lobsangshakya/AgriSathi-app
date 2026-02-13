/**
 * Enhanced Weather Card Component with smooth textures and proper alignment
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EnhancedCard from '@/components/ui/enhanced-card';
import EnhancedButton from '@/components/ui/enhanced-button';
import EnhancedBadge from '@/components/ui/enhanced-badge';
import { 
  Droplets, 
  Sun, 
  Cloud, 
  Wind, 
  Thermometer, 
  MapPin,
  Eye,
  RefreshCw
} from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  location: string;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
}

const WeatherCardEnhanced = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    description: 'Partly cloudy',
    icon: '',
    location: 'Meerut, Uttar Pradesh',
    forecast: [
      { day: 'Monday', high: 32, low: 22, condition: 'Sunny' },
      { day: 'Tuesday', high: 30, low: 21, condition: 'Partly Cloudy' },
      { day: 'Wednesday', high: 29, low: 20, condition: 'Cloudy' },
      { day: 'Thursday', high: 31, low: 22, condition: 'Sunny' },
      { day: 'Friday', high: 33, low: 24, condition: 'Sunny' },
    ]
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const refreshWeather = () => {
    setIsRefreshing(true);
    // Simulate weather refresh
    setTimeout(() => {
      setWeather(prev => ({
        ...prev,
        temperature: Math.floor(Math.random() * 10) + 25,
        humidity: Math.floor(Math.random() * 20) + 50,
        windSpeed: Math.floor(Math.random() * 10) + 5,
      }));
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  const getWeatherIcon = (icon: string) => {
    const iconMap: { [key: string]: string } = {
      '': 'sun',
      '': 'cloud',
      '': 'cloud-rain',
      '': 'cloud-sun-rain',
      '': 'cloud-moon',
      '': 'moon',
      '': 'cloud-lightning',
      '': 'cloud-showers',
      '': 'cloud-rainbow',
    };
    return iconMap[icon] || 'sun';
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 35) return 'text-red-600';
    if (temp >= 30) return 'text-orange-600';
    if (temp >= 25) return 'text-yellow-600';
    if (temp >= 20) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <EnhancedCard variant="elevated" padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-3">
            <Sun className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Weather Updates</h3>
            <p className="text-gray-600">
              {weather.location} • {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <EnhancedButton
          variant="ghost"
          size="sm"
          onClick={refreshWeather}
          disabled={isRefreshing}
          className="relative"
        >
          {isRefreshing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </EnhancedButton>
      </div>

      {/* Current Weather */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-6xl font-bold text-gray-900">
              {weather.temperature}°C
            </div>
            <div className="text-4xl">
              {weather.icon}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Feels like</div>
            <div className="text-2xl font-semibold text-gray-900">
              {Math.round(weather.temperature - 2)}°C
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Droplets className="h-5 w-5 text-blue-500 mb-1" />
            <div className="text-sm text-gray-600">Humidity</div>
            <div className="font-semibold text-gray-900">{weather.humidity}%</div>
          </div>
          <div className="flex flex-col items-center">
            <Wind className="h-5 w-5 text-gray-500 mb-1" />
            <div className="text-sm text-gray-600">Wind</div>
            <div className="font-semibold text-gray-900">{weather.windSpeed} km/h</div>
          </div>
          <div className="flex flex-col items-center">
            <Eye className="h-5 w-5 text-gray-500 mb-1" />
            <div className="text-sm text-gray-600">Visibility</div>
            <div className="font-semibold text-gray-900">10 km</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <EnhancedBadge variant="info" size="md">
          {weather.description}
        </EnhancedBadge>
      </div>

      {/* 5-Day Forecast */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">5-Day Forecast</h4>
        <div className="space-y-3">
          {weather.forecast.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-gray-900">{day.day}</div>
                <div className="text-2xl">
                  {getWeatherIcon(day.condition)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">H: {day.high}°</div>
                <div className="text-sm text-gray-600">L: {day.low}°</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weather Tips */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Farming Tips</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <Droplets className="h-5 w-5 text-blue-500 mt-1" />
            <div>
              <div className="font-medium text-gray-900">Irrigation Advice</div>
              <div className="text-sm text-gray-600 mt-1">
                Perfect weather for watering crops in the evening
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
            <Sun className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <div className="font-medium text-gray-900">Planting Window</div>
              <div className="text-sm text-gray-600 mt-1">
                Great conditions for planting vegetables
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <Thermometer className="h-5 w-5 text-yellow-500 mt-1" />
            <div>
              <div className="font-medium text-gray-900">Temperature Alert</div>
              <div className="text-sm text-gray-600 mt-1">
                Monitor for heat stress in crops
              </div>
            </div>
          </div>
        </div>
      </div>
    </EnhancedCard>
  );
};

export default WeatherCardEnhanced;
