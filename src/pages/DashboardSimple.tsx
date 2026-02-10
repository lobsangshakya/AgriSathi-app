/**
 * Simplified Dashboard - Clean and Farmer-Friendly
 * Focus on core features: Chatbot, Scanner, Login/Logout
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Camera, LogOut } from 'lucide-react';
import { cn } from '@/utils/utils';

const DashboardSimple = () => {
  const { language } = useLanguage();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

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
