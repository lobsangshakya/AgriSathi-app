import { Bell, Globe, Users, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  title: string;
  showLanguageToggle?: boolean;
  showNotifications?: boolean;
}

export const Header = ({ 
  title, 
  showLanguageToggle = true, 
  showNotifications = true 
}: HeaderProps) => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === 'hindi' ? 'english' : 'hindi');
  };

  const navItems = [
    { icon: Users, label: t('nav.community'), path: "/community", key: "community" },
    { icon: User, label: t('nav.profile'), path: "/profile", key: "profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-8 h-8 p-0 hover:bg-transparent"
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center hover:scale-105 transition-transform">
              <span className="text-primary-foreground font-bold text-sm">🌾</span>
            </div>
          </Button>
          <h1 className="text-lg font-semibold text-foreground mr-2">{title}</h1>
          <nav className="flex items-center gap-1 ml-2">
            {navItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0 px-2 py-1 h-auto ${isActive(item.path) ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"}`}
                style={{ minWidth: 36, background: 'none' }}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {showLanguageToggle && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={toggleLanguage}
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm">
                {language === 'hindi' ? t('header.language.english') : t('header.language.hindi')}
              </span>
            </Button>
          )}
          {showNotifications && (
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};