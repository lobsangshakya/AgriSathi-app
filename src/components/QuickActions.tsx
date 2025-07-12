import { Camera, Mic, MessageSquare, MapPin, CloudRain, Coins } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export const QuickActions = () => {
  const actions = [
    {
      icon: Camera,
      label: "फसल स्कैन करें",
      description: "बीमारी की पहचान",
      color: "bg-accent hover:bg-accent/90",
      route: "/disease-detection"
    },
    {
      icon: Mic,
      label: "आवाज में पूछें",
      description: "स्वरबद्ध सहायक",
      color: "bg-primary hover:bg-primary/90",
      route: "/voice-assistant"
    },
    {
      icon: MessageSquare,
      label: "विशेषज्ञ चैट",
      description: "तुरंत सलाह पाएं",
      color: "bg-success hover:bg-success/90",
      route: "/expert-chat"
    },
    {
      icon: CloudRain,
      label: "मौसम जानकारी",
      description: "आज का पूर्वानुमान",
      color: "bg-gradient-sky hover:opacity-90",
      route: "/weather"
    }
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">त्वरित कार्य</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Card key={index} className="p-0 overflow-hidden border-border/50">
            <Button
              variant="ghost"
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
            <span className="font-medium">AgriCreds</span>
          </div>
          <div className="text-lg font-bold">₹ 1,250</div>
        </div>
        <p className="text-sm opacity-90 mt-1">समुदाय में योगदान करके और अधिक कमाएं!</p>
      </Card>
    </div>
  );
};