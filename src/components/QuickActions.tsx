import { Camera, Mic, MessageSquare, MapPin, CloudRain, Coins } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const QuickActions = () => {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);

  const handleAction = (action: string) => {
    switch (action) {
      case 'scan':
        navigate('/disease-detection');
        break;
      case 'voice':
        startVoiceInput();
        break;
      case 'chat':
        navigate('/chat');
        break;
      case 'weather':
        // Show weather info in a toast
        toast({
          title: t('weather.title') || 'Weather Information',
          description: language === 'hindi' 
            ? 'आज का तापमान 25-30°C है। हल्की बारिश की संभावना है।'
            : 'Today\'s temperature is 25-30°C. Light rain expected.',
        });
        break;
    }
  };

  const startVoiceInput = () => {
    setIsListening(true);
    toast({
      title: t('voice.listening') || 'Listening...',
      description: t('voice.speakNow') || 'Speak your question now',
    });
    
    // Simulate voice input
    setTimeout(() => {
      setIsListening(false);
      const voiceQuestions = {
        hindi: [
          "गेहूं की बुआई के लिए सबसे अच्छा समय कौन सा है?",
          "टमाटर में कीट नियंत्रण कैसे करें?",
          "जैविक खेती के फायदे क्या हैं?",
          "मौसम कैसा रहेगा?",
          "बाजार में गेहूं का भाव क्या है?"
        ],
        english: [
          "What is the best time for wheat sowing?",
          "How to control pests in tomato?",
          "What are the benefits of organic farming?",
          "How is the weather today?",
          "What is the market price of wheat?"
        ]
      };
      
      const questions = voiceQuestions[language as keyof typeof voiceQuestions];
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      
      toast({
        title: t('voice.question') || 'Question Detected',
        description: randomQuestion,
      });
      
      // Navigate to chat with the question
      setTimeout(() => {
        navigate('/chat');
      }, 2000);
    }, 3000);
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
      icon: Mic,
      label: t('quickActions.voiceAsk'),
      description: t('quickActions.voiceDescription'),
      color: "bg-primary hover:bg-primary/90",
      action: 'voice'
    },
    {
      icon: MessageSquare,
      label: t('quickActions.expertChat'),
      description: t('quickActions.expertDescription'),
      color: "bg-success hover:bg-success/90",
      action: 'chat'
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
              disabled={action.action === 'voice' && isListening}
              className={`w-full h-auto p-4 ${action.color} text-white flex flex-col items-center gap-2 rounded-lg hover:scale-105 transition-transform duration-200`}
            >
              <action.icon className={`h-8 w-8 ${action.action === 'voice' && isListening ? 'animate-pulse' : ''}`} />
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