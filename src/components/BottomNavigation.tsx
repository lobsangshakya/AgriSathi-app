import { Home, Users, MessageCircle, User, Camera, Wallet, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    { 
      icon: Home, 
      label: t('nav.home'), 
      path: "/", 
      key: "home",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-600"
    },
    { 
      icon: Camera, 
      label: t('nav.scan'), 
      path: "/disease-detection", 
      key: "scan",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600"
    },
    { 
      icon: Users, 
      label: t('nav.community'), 
      path: "/community", 
      key: "community",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-600"
    },
    { 
      icon: MessageCircle, 
      label: t('nav.chat'), 
      path: "/chat", 
      key: "chat",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-600"
    },
    { 
      icon: Wallet, 
      label: t('nav.wallet'), 
      path: "/wallet", 
      key: "wallet",
      color: "from-yellow-500 to-amber-600",
      bgColor: "bg-yellow-500/10",
      iconColor: "text-yellow-600"
    },
    { 
      icon: User, 
      label: t('nav.profile'), 
      path: "/profile", 
      key: "profile",
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-500/10",
      iconColor: "text-indigo-600"
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-card/95 to-card/80 backdrop-blur-md border-t border-border/50 shadow-2xl z-40">
      <div className="max-w-md mx-auto">
        {/* Enhanced Navigation Bar */}
        <div className="flex items-center justify-around py-3 px-2">
          {navItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <Button
                key={item.key}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 p-2 h-auto relative group transition-all duration-300 ${
                  active
                    ? "text-primary transform -translate-y-1"
                    : "text-muted-foreground hover:text-foreground hover:transform hover:-translate-y-0.5"
                }`}
              >
                {/* Active Background Indicator */}
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-xl blur-sm" />
                )}
                
                {/* Icon Container */}
                <div className={`relative z-10 p-2 rounded-full transition-all duration-300 ${
                  active 
                    ? `${item.bgColor} shadow-lg scale-110` 
                    : `${item.bgColor} group-hover:scale-105`
                }`}>
                  <item.icon className={`h-5 w-5 transition-all duration-300 ${
                    active ? item.iconColor : 'text-muted-foreground group-hover:text-foreground'
                  }`} />
                  
                  {/* Active Pulse Effect */}
                  {active && (
                    <div className="absolute inset-0 bg-primary/30 rounded-full animate-pulse-slow" />
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-xs font-medium transition-all duration-300 relative z-10 ${
                  active ? 'text-primary font-semibold' : ''
                }`}>
                  {item.label}
                </span>
                
                {/* Active Indicator Line */}
                {active && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full animate-slide-up" />
                )}
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            );
          })}
        </div>
        
        {/* Enhanced Bottom Indicator */}
        <div className="h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary-glow/20 rounded-full mx-4 mb-2" />
        
        {/* Floating Action Button for Quick Access */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <Button
            variant="default"
            size="sm"
            className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-primary to-primary-glow shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate-float"
            onClick={() => navigate('/disease-detection')}
          >
            <Camera className="h-6 w-6 text-primary-foreground" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse-slow" />
          </Button>
        </div>
      </div>
    </div>
  );
};