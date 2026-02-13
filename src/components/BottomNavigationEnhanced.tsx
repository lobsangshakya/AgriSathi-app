/**
 * Simplified Bottom Navigation - Home, Crop Scanner, Chat
 * Farmer-friendly, no 404s
 */

import { Home, Camera, MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/utils/utils";

export const BottomNavigationEnhanced = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const navItems = [
    { icon: Home, label: language === 'hindi' ? 'होम' : 'Home', path: "/", key: "home", color: "bg-green-500" },
    { icon: Camera, label: language === 'hindi' ? 'फसल जांच' : 'Crop Scanner', path: "/disease-detection", key: "scan", color: "bg-blue-500" },
    { icon: MessageCircle, label: language === 'hindi' ? 'चैट' : 'Chat', path: "/chat", key: "chat", color: "bg-green-500" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-around items-center py-3">
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
                "flex flex-col items-center gap-1 h-auto py-2 px-4 rounded-lg transition-colors",
                active ? item.color + " text-white hover:opacity-90" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
