import { Bell, Globe, Sparkles, Search, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/Logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "./ui/dropdown-menu";
=======
import { Bell, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: language === 'hindi' ? 'फसल सलाह' : 'Crop Advice',
      message: language === 'hindi' ? 'आपकी टमाटर फसल के लिए नई सलाह उपलब्ध है' : 'New advice available for your tomato crop',
      time: '2 min ago',
      read: false,
      type: 'advice',
      priority: 'high'
    },
    {
      id: 2,
      title: language === 'hindi' ? 'मौसम अपडेट' : 'Weather Update',
      message: language === 'hindi' ? 'कल बारिश की संभावना है, सिंचाई की योजना बनाएं' : 'Rain expected tomorrow, plan irrigation accordingly',
      time: '15 min ago',
      read: false,
      type: 'weather',
      priority: 'medium'
    },
    {
      id: 3,
      title: language === 'hindi' ? 'समुदाय अपडेट' : 'Community Update',
      message: language === 'hindi' ? 'आपके पोस्ट पर 5 नई टिप्पणियां हैं' : '5 new comments on your post',
      time: '1 hour ago',
      read: true,
      type: 'community',
      priority: 'low'
    }
  ]);
=======

  const toggleLanguage = () => {
    setLanguage(language === 'hindi' ? 'english' : 'hindi');
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'advice':
        return '🌱';
      case 'weather':
        return '🌤️';
      case 'community':
        return '👥';
      default:
        return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleViewAllNotifications = () => {
    toast({
      title: language === 'hindi' ? 'सभी सूचनाएं' : 'All Notifications',
      description: language === 'hindi' 
        ? `${notifications.length} सूचनाएं उपलब्ध हैं`
        : `${notifications.length} notifications available`,
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary/95 to-primary-glow/95 backdrop-blur-md border-b border-primary/20 shadow-lg">
      <div className="flex items-center justify-between p-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <img 
              src={logo} 
              alt="AgriSaathi Logo" 
              className="h-10 w-10 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white group-hover:text-primary-foreground transition-colors duration-300">
              {title}
            </h1>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-yellow-300 animate-pulse-slow" />
              <span className="text-xs text-primary-foreground/80">
                {language === 'hindi' ? 'स्मार्ट खेती' : 'Smart Farming'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full p-2 h-9 w-9"
            onClick={() => toast({
              title: 'Search',
              description: 'Search functionality coming soon!',
            })}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Language Toggle */}
=======
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">🌾</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">

          {showLanguageToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-white hover:bg-white/20 rounded-full p-2 h-9 w-9 relative group"
            >
              <Globe className="h-4 w-4" />
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-primary-foreground text-primary px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {language === 'hindi' ? 'EN' : 'हिं'}
              </span>
            </Button>
          )}

          {/* Notifications */}
=======
          {showNotifications && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-2 h-9 w-9 relative"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold animate-bounce-gentle"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="w-80 max-h-96 overflow-y-auto bg-gradient-card border-border/50 shadow-card"
              >
                <div className="flex items-center justify-between p-3 border-b border-border/50">
                  <h3 className="font-semibold text-gradient">
                    {language === 'hindi' ? 'सूचनाएं' : 'Notifications'}
                  </h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:text-primary/80"
                    >
                      {language === 'hindi' ? 'सभी पढ़ें' : 'Mark all read'}
                    </Button>
                  )}
                </div>
                
                <div className="space-y-1 p-2">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                          notification.read ? 'opacity-60' : ''
                        } ${getPriorityColor(notification.priority)}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-medium text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {notification.time}
                              </span>
                            </div>
                            <p className={`text-xs leading-relaxed ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-slow" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">
                        {language === 'hindi' ? 'कोई सूचना नहीं' : 'No notifications'}
                      </p>
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewAllNotifications}
                      className="w-full"
                    >
                      {language === 'hindi' ? 'सभी देखें' : 'View All'}
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full p-2 h-9 w-9"
            onClick={() => navigate('/profile')}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
