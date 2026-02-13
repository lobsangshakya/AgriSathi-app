/**
 * Simplified Dashboard - Clean and Farmer-Friendly
 * Focus on core features: Chatbot, Scanner, Weather, Community
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Cloud, Droplets, Wind, Users } from 'lucide-react';
import { apiService } from '@/services/api';
import type { WeatherData } from '@/services/api';
import { motion } from 'framer-motion';

// Assets
import weatherBg from '@/assets/dashboard_weather_bg.png';
import chatbotImg from '@/assets/dashboard_chatbot.png';
import scannerImg from '@/assets/dashboard_scanner.png';

const DashboardSimple = () => {
  const { language } = useLanguage();
  const { user, logout, locationData, detectLocation } = useUser();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherStatus, setWeatherStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

  const fetchWeather = useCallback(() => {
    if (!locationData) return;

    setWeatherStatus('loading');
    apiService.getWeatherData(locationData.latitude, locationData.longitude)
      .then((data) => {
        setWeather(data);
        setWeatherStatus('ok');
      })
      .catch(() => {
        setWeatherStatus('error');
      });
  }, [locationData]);

  useEffect(() => {
    if (locationData) {
      fetchWeather();
    }
  }, [locationData, fetchWeather]);

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                {language === 'hindi' ? 'AgriSaathi' : 'AgriSathi'}
              </h1>
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                {language === 'hindi'
                  ? `${user?.name || 'किसान भाई'} | ${currentTime.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}`
                  : `${user?.name || 'Farmer'} | ${currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                }
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        className="max-w-md mx-auto px-4 py-6 space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Weather Card */}
        <motion.div variants={item}>
          <Card className="overflow-hidden rounded-2xl border-0 shadow-lg relative h-48 group">
            <div className="absolute inset-0 bg-gray-900">
              <img
                src={weatherBg}
                alt="Weather Background"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            <div className="relative h-full p-5 flex flex-col justify-between text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg opacity-90">
                    {language === 'hindi' ? 'आज का मौसम' : "Today's Weather"}
                  </h3>
                  <p className="text-sm opacity-75">
                    {!locationData && (language === 'hindi' ? 'स्थान का पता लगाया जा रहा है...' : 'Detecting location...')}
                    {locationData && weatherStatus === 'loading' && (language === 'hindi' ? 'लोड हो रहा है...' : 'Loading...')}
                    {weatherStatus === 'error' && (language === 'hindi' ? 'अनुपलब्ध' : 'Unavailable')}
                    {weatherStatus === 'ok' && weather?.location}
                  </p>
                </div>
                {weatherStatus === 'ok' && weather && (
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      alt="Weather Icon"
                      className="w-8 h-8"
                    />
                  </div>
                )}
              </div>

              {weatherStatus === 'ok' && weather ? (
                <div>
                  <div className="text-4xl font-bold mb-1">
                    {Math.round(weather.temperature)}°
                  </div>
                  <div className="flex gap-4 text-sm opacity-90">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3" /> {weather.humidity}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3" /> {weather.windSpeed} m/s
                    </span>
                  </div>
                  <p className="text-sm mt-2 font-medium capitalize opacity-90">
                    {weather.description}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  {(!locationData || weatherStatus === 'loading') ? (
                    <Cloud className="w-8 h-8 animate-pulse opacity-50" />
                  ) : (
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                      onClick={() => detectLocation()}
                    >
                      {language === 'hindi' ? 'स्थान सक्षम करें' : 'Enable Location'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Chatbot Card */}
          <motion.div variants={item} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}>
            <Card
              className="overflow-hidden rounded-2xl border-0 shadow-md cursor-pointer h-36 relative bg-gradient-to-br from-emerald-50 to-white"
              onClick={() => navigate('/chat')}
            >
              <div className="absolute right-0 bottom-0 w-20 h-20 opacity-80 translate-x-2 translate-y-2">
                <img src={chatbotImg} alt="Chatbot" className="w-full h-full object-contain drop-shadow-xl" />
              </div>
              <div className="p-4 h-full flex flex-col justify-center relative z-10">
                <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center mb-2 text-green-600">
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-0.5">
                  {language === 'hindi' ? 'कृषि सहायक' : 'Farm Assistant'}
                </h3>
                <p className="text-xs text-gray-500 leading-snug">
                  {language === 'hindi' ? 'फसलों के बारे में पूछें' : 'Ask about crops'}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Scanner Card */}
          <motion.div variants={item} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}>
            <Card
              className="overflow-hidden rounded-2xl border-0 shadow-md cursor-pointer h-36 relative bg-gradient-to-br from-blue-50 to-white"
              onClick={() => navigate('/disease-detection')}
            >
              <div className="absolute right-0 bottom-0 w-20 h-20 opacity-80 translate-x-2 translate-y-2">
                <img src={scannerImg} alt="Scanner" className="w-full h-full object-contain drop-shadow-xl" />
              </div>
              <div className="p-4 h-full flex flex-col justify-center relative z-10">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center mb-2 text-blue-600">
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-0.5">
                  {language === 'hindi' ? 'फसल डॉक्टर' : 'Crop Doctor'}
                </h3>
                <p className="text-xs text-gray-500 leading-snug">
                  {language === 'hindi' ? 'बीमारी पहचानें' : 'Detect diseases'}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Community Card */}
          <motion.div variants={item} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} className="col-span-2">
            <Card
              className="overflow-hidden rounded-2xl border-0 shadow-md cursor-pointer h-28 relative bg-gradient-to-br from-orange-50 to-amber-50"
              onClick={() => navigate('/community')}
            >
              <div className="p-4 h-full flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-tight mb-0.5">
                    {language === 'hindi' ? 'किसान समुदाय' : 'Farmer Community'}
                  </h3>
                  <p className="text-sm text-gray-500 leading-snug">
                    {language === 'hindi'
                      ? 'अनुभव साझा करें, सवाल पूछें'
                      : 'Share experiences, ask questions'}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardSimple;
