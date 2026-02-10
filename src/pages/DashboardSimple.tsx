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
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Camera, 
  LogOut, 
  User,
  Sun,
  Droplets,
  Phone
} from 'lucide-react';
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

  const quickInfo = [
    {
      icon: Sun,
      label: language === 'hindi' ? 'आज का मौसम' : "Today's Weather",
      value: language === 'hindi' ? '28°C सूरज' : '28°C Sunny',
      color: 'text-orange-500'
    },
    {
      icon: Droplets,
      label: language === 'hindi' ? 'सिंचाई' : 'Irrigation',
      value: language === 'hindi' ? 'शाम को अच्छा' : 'Evening best',
      color: 'text-blue-500'
    },
    {
      icon: Phone,
      label: language === 'hindi' ? 'विशेषज्ञ' : 'Expert Help',
      value: language === 'hindi' ? 'उपलब्ध' : 'Available',
      color: 'text-green-500'
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

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Quick Info Bar */}
        <div className="grid grid-cols-3 gap-3">
          {quickInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <Card key={index} className="p-3 text-center">
                <Icon className={cn("w-5 h-5 mx-auto mb-1", info.color)} />
                <p className="text-xs text-gray-600">{info.label}</p>
                <p className="text-sm font-medium text-gray-900">{info.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Main Features */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'hindi' ? 'मुख्य सेवाएं' : 'Main Services'}
          </h2>
          <div className="space-y-3">
            {mainFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id} className="overflow-hidden">
                  <button
                    onClick={() => navigate(feature.route)}
                    className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className={cn("p-3 rounded-lg text-white", feature.color)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* User Status */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {language === 'hindi' ? 'खाता स्थिति' : 'Account Status'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'hindi' 
                  ? `${user?.name || 'किसान भाई'} - सक्रिय` 
                  : `${user?.name || 'Farmer'} - Active`
                }
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {language === 'hindi' ? 'ऑनलाइन' : 'Online'}
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSimple;
