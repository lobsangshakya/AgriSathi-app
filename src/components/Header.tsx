import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Globe, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { useDebounce } from "@/utils/performance";
import { handleToastError } from "@/utils/errorHandler";
import { LocationManager } from "./LocationManager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "./ui/dropdown-menu";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: language === "hindi" ? "नया संदेश" : "New Message",
      description: language === "hindi" ? "आपके पास एक नया संदेश है" : "You have a new message",
      read: false,
      timestamp: new Date()
    },
    {
      id: "2",
      title: language === "hindi" ? "फसल अपडेट" : "Crop Update",
      description: language === "hindi" ? "आपकी फसल की स्थिति अपडेट हुई है" : "Your crop status has been updated",
      read: true,
      timestamp: new Date(Date.now() - 3600000)
    }
  ]);

  const toggleLanguage = () => {
    setLanguage(language === 'hindi' ? 'english' : 'hindi');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          </div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <LocationManager />

          {showLanguageToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-foreground hover:bg-accent rounded-full p-2 h-9 w-9 relative group"
            >
              <Globe className="h-4 w-4" />
            </Button>
          )}

          {showNotifications && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:bg-accent rounded-full p-2 h-9 w-9 relative"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-3 cursor-pointer hover:bg-accent ${!notification.read ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{notification.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};