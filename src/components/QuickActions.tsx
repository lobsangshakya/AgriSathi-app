import { Camera, CloudRain, Coins } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const QuickActions = () => {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();

  const handleAction = (action: string) => {
    switch (action) {
      case 'scan':
        navigate('/disease-detection');
        break;
      case 'weather':
        toast({
          title: t('weather.title') || 'Weather Information',
          description: language === 'hindi' 
            ? 'आज का तापमान 25-30°C है। हल्की बारिश की संभावना है।'
            : 'Today\'s temperature is 25-30°C. Light rain expected.',
        });
        break;
    }
  };

  const actions = [
    {
      icon: Camera,
      label: t('quickActions.scanCrop'),
      description: t('quickActions.scanDescription'),
      color: "bg-accent hover:bg-accent/90",
      action: 'scan'
    },
    {
      icon: CloudRain,
      label: t('quickActions.weather'),
      description: t('quickActions.weatherDescription'),
      color: "bg-gradient-sky hover:opacity-90",
      action: 'weather'
    }
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">{t('dashboard.quickActions')}</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Card key={index} className="p-0 overflow-hidden border-border/50">
            <Button
              variant="ghost"
              onClick={() => handleAction(action.action)}
              className={`w-full h-auto p-4 ${action.color} text-white flex flex-col items-center gap-2 rounded-lg hover:scale-105 transition-transform duration-200`}
            >
              <action.icon className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          </Card>
        ))}
      </div>
      
      {/* AgriCreds Display */}
      <Card className="mt-4 p-4 bg-gradient-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            <span className="font-medium">{t('quickActions.agriCreds')}</span>
          </div>
          <div className="text-lg font-bold">₹ {user?.agriCreds || 0}</div>
        </div>
        <p className="text-sm opacity-90 mt-1">{t('quickActions.earnMore')}</p>
      </Card>
    </div>
  );
};