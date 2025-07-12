import { Bell, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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
            <Button variant="ghost" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              <span className="text-sm">हिं</span>
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