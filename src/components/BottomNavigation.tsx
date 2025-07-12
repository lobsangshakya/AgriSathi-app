import { Home, Users, MessageCircle, User, Camera } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    { icon: Home, label: t('nav.home'), path: "/", key: "home" },
    { icon: Camera, label: t('nav.scan'), path: "/disease-detection", key: "scan" },
    { icon: Users, label: t('nav.community'), path: "/community", key: "community" },
    { icon: MessageCircle, label: t('nav.chat'), path: "/chat", key: "chat" },
    { icon: User, label: t('nav.profile'), path: "/profile", key: "profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Button
            key={item.key}
            variant="ghost"
            size="sm"
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 p-2 h-auto ${
              isActive(item.path)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};