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
      
      navigate('/chat', { 
        state: { 
          initialMessage: randomQuestion 
        } 
      });
    }, 2000);
  };

  const quickActions = [
    {
      icon: Camera,
      label: t('quickActions.scan') || 'Scan Plant',
      action: 'scan',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      description: t('quickActions.scanDesc') || 'Identify diseases and get treatment advice'
    },
    {
      icon: isListening ? Mic : Mic,
      label: t('quickActions.voice') || 'Voice Query',
      action: 'voice',
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      description: t('quickActions.voiceDesc') || 'Ask questions using your voice',
      isActive: isListening
    },
    {
      icon: MessageSquare,
      label: t('quickActions.chat') || 'AI Chat',
      action: 'chat',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      description: t('quickActions.chatDesc') || 'Get instant farming advice'
    },
    {
      icon: CloudRain,
      label: t('quickActions.weather') || 'Weather',
      action: 'weather',
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      description: t('quickActions.weatherDesc') || 'Check current weather conditions'
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          {t('quickActions.title') || 'Quick Actions'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/agri-credits')}
          className="text-amber-600 hover:text-amber-700"
        >
          <Coins className="h-4 w-4 mr-1" />
          {user?.agriCreds || 0}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card
              key={index}
              className={`p-4 cursor-pointer hover:shadow-lg transition-all duration-300 group ${
                item.isActive ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-lg'
              }`}
              onClick={() => handleAction(item.action)}
            >
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-6 w-6 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent ${item.isActive ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};