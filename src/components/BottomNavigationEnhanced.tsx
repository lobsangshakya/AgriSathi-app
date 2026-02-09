/**
 * Enhanced Bottom Navigation with clearer labels and better UX
 * Designed specifically for farmers with intuitive icons and descriptions
 */

import { Home, Camera, Users, MessageCircle, Wallet, HelpCircle, Cloud, TrendingUp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/utils/utils";

export const BottomNavigationEnhanced = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const navItems = [
    { 
      icon: Home, 
      label: language === 'hindi' ? 'होम' : 'Home',
      description: language === 'hindi' ? 'मुख्य पृष्ठ' : 'Main Page',
      path: "/", 
      key: "home",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-600"
    },
    { 
      icon: Camera, 
      label: language === 'hindi' ? 'फसल जांच' : 'Crop Check',
      description: language === 'hindi' ? 'बीमारी की पहचान' : 'Disease Detection',
      path: "/disease-detection", 
      key: "scan",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600",
      badge: language === 'hindi' ? 'AI' : 'AI'
    },
    { 
      icon: Users, 
      label: language === 'hindi' ? 'समुदाय' : 'Community',
      description: language === 'hindi' ? 'किसान सहायता' : 'Farmer Help',
      path: "/community", 
      key: "community",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-600"
    },
    { 
      icon: MessageCircle, 
      label: language === 'hindi' ? 'विशेषज्ञ' : 'Expert',
      description: language === 'hindi' ? 'बात करें' : 'Chat Now',
      path: "/chat", 
      key: "chat",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-600",
      badge: language === 'hindi' ? 'ऑनलाइन' : 'Online'
    },
    { 
      icon: Wallet, 
      label: language === 'hindi' ? 'वॉलेट' : 'Wallet',
      description: language === 'hindi' ? 'क्रेडिट्स' : 'Credits',
      path: "/wallet", 
      key: "wallet",
      color: "from-yellow-500 to-amber-600",
      bgColor: "bg-yellow-500/10",
      iconColor: "text-yellow-600"
    }
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-md mx-auto">
        {/* Navigation Tips */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 border-b border-green-100">
          <div className="flex items-center justify-between text-xs text-green-700">
            <span>{language === 'hindi' ? '🌾 अपनी फसलों का ख्याल रखें' : '🌾 Take care of your crops'}</span>
            <span>{language === 'hindi' ? 'स्वस्थ फसलें, अच्छी आमदनी' : 'Healthy crops, better income'}</span>
          </div>
        </div>
        
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            
            return (
              <Button
                key={item.key}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-lg transition-all duration-200 relative",
                  active 
                    ? "bg-gradient-to-br " + item.color + " text-white shadow-md scale-105" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    active ? "scale-110" : "scale-100"
                  )} />
                  {item.badge && (
                    <Badge 
                      variant={active ? "secondary" : "default"}
                      className="absolute -top-2 -right-2 text-[10px] px-1 h-4 min-w-4 flex items-center justify-center"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <span className={cn(
                    "text-xs font-medium transition-all duration-200",
                    active ? "text-white" : "text-current"
                  )}>
                    {item.label}
                  </span>
                  {!active && (
                    <span className="text-[10px] text-gray-500 leading-tight text-center max-w-[60px]">
                      {item.description}
                    </span>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
        
        {/* Quick Access Bar */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/weather')}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <Cloud className="w-3 h-3" />
                <span>{language === 'hindi' ? 'मौसम' : 'Weather'}</span>
              </button>
              <button 
                onClick={() => navigate('/market')}
                className="flex items-center gap-1 text-green-600 hover:text-green-700"
              >
                <TrendingUp className="w-3 h-3" />
                <span>{language === 'hindi' ? 'बाजार' : 'Market'}</span>
              </button>
            </div>
            <button 
              onClick={() => navigate('/help')}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-700"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{language === 'hindi' ? 'मदद' : 'Help'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
