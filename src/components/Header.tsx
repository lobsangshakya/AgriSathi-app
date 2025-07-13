import { Bell, Globe } from "lucide-react";
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
      type: 'advice'
    },
    {
      id: 2,
      title: language === 'hindi' ? 'मौसम अपडेट' : 'Weather Update',
      message: language === 'hindi' ? 'कल बारिश की संभावना है, सिंचाई की योजना बनाएं' : 'Rain expected tomorrow, plan irrigation accordingly',
      time: '15 min ago',
      read: false,
      type: 'weather'
    },
    {
      id: 3,
      title: language === 'hindi' ? 'समुदाय अपडेट' : 'Community Update',
      message: language === 'hindi' ? 'आपके पोस्ट पर 5 नई टिप्पणियां हैं' : '5 new comments on your post',
      time: '1 hour ago',
      read: true,
      type: 'community'
    }
  ]);

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

  const handleViewAllNotifications = () => {
    // For now, show a toast with notification details
    toast({
      title: language === 'hindi' ? 'सभी सूचनाएं' : 'All Notifications',
      description: language === 'hindi' 
        ? `${notifications.length} सूचनाएं उपलब्ध हैं`
        : `${notifications.length} notifications available`,
    });
    // In a real app, navigate to notifications page
    // navigate('/notifications');
  };

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={logo} alt="AgriSaathi" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between p-2">
                  <h3 className="font-semibold text-sm">
                    {language === 'hindi' ? 'सूचनाएं' : 'Notifications'}
                  </h3>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={markAllAsRead}
                    >
                      {language === 'hindi' ? 'सभी पढ़ें' : 'Mark all read'}
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    {language === 'hindi' ? 'कोई सूचना नहीं' : 'No notifications'}
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id}
                      className={`p-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-center text-primary text-sm font-medium"
                  onClick={handleViewAllNotifications}
                >
                  {language === 'hindi' ? 'सभी सूचनाएं देखें' : 'View all notifications'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};