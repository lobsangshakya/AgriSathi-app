/**
 * Simplified Dashboard - Clean and Farmer-Friendly
 * Focus on core features: Chatbot, Scanner, Weather, Login/Logout
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Camera, LogOut, Cloud } from 'lucide-react';
import { cn } from '@/utils/utils';
import { apiService, getLocation } from '@/services/api';
import type { WeatherData } from '@/services/api';

const DashboardSimple = () => {
  const { language } = useLanguage();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherStatus, setWeatherStatus] = useState<'idle' | 'loading' | 'ok' | 'denied' | 'error'>('idle');

  const fetchWeather = useCallback(() => {
    setWeatherStatus('loading');
    getLocation()
      .then(({ latitude, longitude }) => apiService.getWeatherData(latitude, longitude))
      .then((data) => {
        setWeather(data);
        setWeatherStatus('ok');
      })
      .catch((err) => {
        const msg = err?.message ?? '';
        if (msg.includes('denied') || err?.code === 1) {
          setWeatherStatus('denied');
        } else {
          setWeatherStatus('error');
        }
      });
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const mainFeatures = [
    {
      id: 'chatbot',
      title: language === 'hindi' ? 'कृषि सहायक' : 'Farming Assistant',
      description: language === 'hindi'
        ? 'फसलों, मौसम, बाजार के बारे में पूछें'
        : 'Ask about crops, weather, market',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      route: '/chat'
    },
    {
      id: 'scanner',
      title: language === 'hindi' ? 'फसल जांच' : 'Crop Scanner',
      description: language === 'hindi'
        ? 'बीमारी की पहचान करें'
        : 'Detect crop diseases',
      icon: Camera,
      color: 'bg-blue-500 hover:bg-blue-600',
      route: '/disease-detection'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'hindi' ? 'AgriSaathi' : 'AgriSathi'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'hindi' 
                  ? `${user?.name || 'किसान भाई'} | ${currentTime.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}`
                  : `${user?.name || 'Farmer'} | ${currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                }
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {language === 'hindi' ? 'लॉगआउट' : 'Logout'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Weather (location-based) */}
        <Card className="mb-4 overflow-hidden">
          <div className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-sky-500 text-white shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">
                {language === 'hindi' ? 'मौसम' : 'Weather'}
              </h3>
              {weatherStatus === 'loading' && (
                <p className="text-sm text-gray-600">
                  {language === 'hindi' ? 'स्थान और मौसम लोड हो रहा है...' : 'Loading location & weather...'}
                </p>
              )}
              {weatherStatus === 'denied' && (
                <p className="text-sm text-gray-600">
                  {language === 'hindi' ? 'स्थान की अनुमति नहीं मिली। मौसम दिखाने के लिए लोकेशन चालू करें।' : 'Location permission denied. Enable location to see weather.'}
                </p>
              )}
              {weatherStatus === 'error' && (
                <p className="text-sm text-gray-600">
                  {language === 'hindi' ? 'मौसम लोड नहीं हो सका।' : 'Could not load weather.'}
                </p>
              )}
              {weatherStatus === 'ok' && weather && (
                <p className="text-sm text-gray-900">
                  {Math.round(weather.temperature)}°C · {weather.description}
                  {' '}({language === 'hindi' ? 'नमी ' : 'Humidity '}{weather.humidity}%)
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">
            {language === 'hindi' ? 'मुख्य सेवाएं' : 'Main Services'}
          </h2>
          {mainFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.id} className="overflow-hidden">
                <button
                  onClick={() => navigate(feature.route)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={cn('p-3 rounded-lg text-white shrink-0', feature.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardSimple;
