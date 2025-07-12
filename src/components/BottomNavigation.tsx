import { Home, Users, MessageCircle, User, Camera } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "होम", path: "/", key: "home" },
    { icon: Camera, label: "स्कैन", path: "/disease-detection", key: "scan" },
    { icon: Users, label: "समुदाय", path: "/community", key: "community" },
    { icon: MessageCircle, label: "चैट", path: "/chat", key: "chat" },
    { icon: User, label: "प्रोफाइल", path: "/profile", key: "profile" },
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