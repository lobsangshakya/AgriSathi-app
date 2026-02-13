/**
 * Clean and Intuitive Dashboard for Farmers
 * Clear feature explanations and logical grouping
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AuthModal from '@/components/AuthModal';
import { 
  Camera, 
  MessageCircle, 
  Cloud, 
  TrendingUp, 
  Users, 
  Droplets,
  Sun,
  Wind,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Phone,
  HelpCircle,
  Leaf,
  Zap
} from 'lucide-react';
import { cn } from '@/utils/utils';

const DashboardClean = () => {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const welcomeMessage = language === 'hindi' 
    ? `नमस्ते ${user?.name || 'किसान भाई'}! `
    : `Hello ${user?.name || 'Farmer'}! `;

  const todayDate = currentTime.toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mainFeatures = [
    {
      id: 'disease',
      icon: Camera,
      title: language === 'hindi' ? 'फसल जांच' : 'Crop Check',
      description: language === 'hindi' 
        ? 'फसल की बीमारी की पहचान करें' 
        : 'Detect crop diseases instantly',
      subtitle: language === 'hindi' 
        ? 'AI से तुरंत जांच' 
        : 'AI-powered analysis',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      path: '/disease-detection',
      badge: 'AI',
      priority: 'high'
    },
    {
      id: 'expert',
      icon: MessageCircle,
      title: language === 'hindi' ? 'विशेषज्ञ सलाह' : 'Expert Advice',
      description: language === 'hindi' 
        ? 'कृषि विशेषज्ञ से बात करें' 
        : 'Talk to agriculture experts',
      subtitle: language === 'hindi' 
        ? 'मुफ्त सलाह' 
        : 'Free consultation',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      path: '/chat',
      badge: language === 'hindi' ? 'ऑनलाइन' : 'Online',
      priority: 'high'
    },
    {
      id: 'weather',
      icon: Cloud,
      title: language === 'hindi' ? 'मौसम जानकारी' : 'Weather Info',
      description: language === 'hindi' 
        ? 'आज का मौसम और पूर्वानुमान' 
        : "Today's weather & forecast",
      subtitle: language === 'hindi' 
        ? '5 दिन का पूर्वानुमान' 
        : '5-day forecast',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      path: '/weather',
      priority: 'medium'
    },
    {
      id: 'community',
      icon: Users,
      title: language === 'hindi' ? 'किसान समुदाय' : 'Farmer Community',
      description: language === 'hindi' 
        ? 'दूसरे किसानों से जुड़ें' 
        : 'Connect with other farmers',
      subtitle: language === 'hindi' 
        ? 'अनुभव साझा करें' 
        : 'Share experiences',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      path: '/community',
      priority: 'medium'
    }
  ];

  const quickActions = [
    {
      icon: Phone,
      label: language === 'hindi' ? 'आपातकालीन सहायता' : 'Emergency Help',
      description: language === 'hindi' ? 'तुरंत मदद' : 'Immediate help',
      color: 'text-red-600',
      action: () => navigate('/emergency')
    },
    {
      icon: TrendingUp,
      label: language === 'hindi' ? 'बाजार भाव' : 'Market Prices',
      description: language === 'hindi' ? 'आज के दाम' : "Today's prices",
      color: 'text-green-600',
      action: () => navigate('/market')
    },
    {
      icon: Leaf,
      label: language === 'hindi' ? 'फसल सुझाव' : 'Crop Tips',
      description: language === 'hindi' ? 'बेहतर उत्पादन' : 'Better yield',
      color: 'text-emerald-600',
      action: () => navigate('/crops')
    },
    {
      icon: HelpCircle,
      label: language === 'hindi' ? 'उपयोग मार्गदर्शन' : 'User Guide',
      description: language === 'hindi' ? 'कैसे उपयोग करें' : 'How to use',
      color: 'text-blue-600',
      action: () => navigate('/help')
    }
  ];

  const weatherData = {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    condition: language === 'hindi' ? 'आंशिक बादल' : 'Partly Cloudy',
    icon: '',
    rainChance: 20
  };

  const alerts = [
    {
      type: 'warning',
      icon: AlertTriangle,
      message: language === 'hindi' 
        ? ' टमाटर में कीट प्रकोप की संभावना' 
        : ' Possible pest attack in tomatoes',
      action: language === 'hindi' ? 'जांच करें' : 'Check Now'
    },
    {
      type: 'info',
      icon: Droplets,
      message: language === 'hindi' 
        ? ' कल सुबह सिंचाई करने का समय' 
        : ' Good time for irrigation tomorrow morning',
      action: language === 'hindi' ? 'याद रखें' : 'Remember'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header title={t('header.agrisathi')} />
      
      <div className="max-w-md mx-auto px-4 py-6 pb-32">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{welcomeMessage}</h1>
                  <p className="text-green-100 text-sm">{todayDate}</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Leaf className="w-6 h-6" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-lg font-bold">{user?.agriCreds || 0}</div>
                  <div className="text-xs text-green-100">{language === 'hindi' ? 'क्रेडिट्स' : 'Credits'}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-lg font-bold">{weatherData.temperature}°C</div>
                  <div className="text-xs text-green-100">{language === 'hindi' ? 'तापमान' : 'Temp'}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-lg font-bold">{weatherData.humidity}%</div>
                  <div className="text-xs text-green-100">{language === 'hindi' ? 'नमी' : 'Humidity'}</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Features */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            {language === 'hindi' ? 'मुख्य सेवाएं' : 'Main Services'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-0",
                      feature.bgColor
                    )}
                    onClick={() => navigate(feature.path)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn("p-2 rounded-lg", feature.bgColor)}>
                          <Icon className={cn("w-6 h-6", feature.iconColor)} />
                        </div>
                        {feature.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {feature.subtitle}
                        <ArrowRight className="w-3 h-3" />
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'hindi' ? 'त्वरित कार्य' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 justify-start hover:bg-gray-50"
                    onClick={action.action}
                  >
                    <Icon className={cn("w-5 h-5 mr-3", action.color)} />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{action.label}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Weather Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'hindi' ? 'आज का मौसम' : "Today's Weather"}
          </h2>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{weatherData.icon}</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{weatherData.temperature}°C</div>
                    <div className="text-sm text-gray-600">{weatherData.condition}</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/weather')}
                >
                  {language === 'hindi' ? 'विस्तार' : 'Details'}
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/50 rounded-lg p-2">
                  <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <div className="text-xs text-gray-600">{language === 'hindi' ? 'नमी' : 'Humidity'}</div>
                  <div className="text-sm font-semibold">{weatherData.humidity}%</div>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <Wind className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                  <div className="text-xs text-gray-600">{language === 'hindi' ? 'हवा' : 'Wind'}</div>
                  <div className="text-sm font-semibold">{weatherData.windSpeed} km/h</div>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <Thermometer className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                  <div className="text-xs text-gray-600">{language === 'hindi' ? 'अनुभूति' : 'Feels'}</div>
                  <div className="text-sm font-semibold">{weatherData.temperature - 2}°C</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Important Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'hindi' ? 'महत्वपूर्ण सूचनाएं' : 'Important Alerts'}
            </h2>
            <div className="space-y-3">
              {alerts.map((alert, index) => {
                const Icon = alert.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Card className={cn(
                      "border-l-4 p-4",
                      alert.type === 'warning' 
                        ? 'border-orange-400 bg-orange-50' 
                        : 'border-blue-400 bg-blue-50'
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={cn(
                            "w-5 h-5",
                            alert.type === 'warning' ? 'text-orange-600' : 'text-blue-600'
                          )} />
                          <p className="text-sm text-gray-700">{alert.message}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">
                          {alert.action}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Help Section */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="p-4 text-center">
            <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">
              {language === 'hindi' ? 'मदद चाहिए?' : 'Need Help?'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {language === 'hindi' 
                ? 'हमारे विशेषज्ञ हमेशा आपकी सहायता के लिए तैयार हैं' 
                : 'Our experts are always ready to help you'
              }
            </p>
            <Button 
              size="sm" 
              onClick={() => navigate('/help')}
              className="bg-gray-800 hover:bg-gray-900"
            >
              {language === 'hindi' ? 'सहायता केंद्र' : 'Help Center'}
            </Button>
          </div>
        </Card>
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialView={authView}
        />
      </div>
    </div>
  );
};

export default DashboardClean;
