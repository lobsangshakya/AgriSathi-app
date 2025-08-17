import { Camera, Mic, MessageSquare, MapPin, CloudRain, Coins, Sparkles, Zap, Target, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const QuickActions = () => {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const handleAction = (action: string) => {
    switch (action) {
      case 'scan':
        navigate('/disease-detection');
        break;
      case 'voice':
        startVoiceInput();
        break;
      case 'chat':
        // Navigate to AgriCredits page for expert consultation
        navigate('/agri-credits', { 
          state: { 
            fromExpertChat: true 
          } 
        });
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
    console.log('Starting voice input...');
    console.log('Browser support check:', {
      webkitSpeechRecognition: 'webkitSpeechRecognition' in window,
      SpeechRecognition: 'SpeechRecognition' in window
    });
    
    // Check if we're in a secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      toast({
        title: t('voice.notSupported') || 'Voice Not Supported',
        description: 'Voice recognition requires a secure connection (HTTPS or localhost)',
        variant: 'destructive',
      });
      return;
    }
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: t('voice.notSupported') || 'Voice Not Supported',
        description: t('voice.browserSupport') || 'Your browser does not support speech recognition',
        variant: 'destructive',
      });
      return;
    }

    setIsListening(true);
    setTranscript("");

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    // Configure recognition settings
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
    recognitionRef.current.maxAlternatives = 1;

    // Handle results
    recognitionRef.current.onresult = (event: any) => {
      console.log('Voice recognition result:', event);
      const result = event.results[0];
      const detectedText = result[0].transcript;
      console.log('Detected text:', detectedText);
      setTranscript(detectedText);

      toast({
        title: t('voice.detected') || 'Voice Detected',
        description: detectedText,
        variant: 'default',
      });

      // Navigate to chat with the detected text
      setTimeout(() => {
        navigate('/chat', { 
          state: { 
            initialMessage: detectedText 
          } 
        });
      }, 2000);

      setIsListening(false);
    };

    // Handle errors
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = 'Voice recognition failed';
      if (event.error === 'no-speech') {
        errorMessage = language === 'hindi' ? 'कोई आवाज नहीं सुनाई दी' : 'No speech detected';
      } else if (event.error === 'audio-capture') {
        errorMessage = language === 'hindi' ? 'माइक्रोफोन तक पहुंच नहीं' : 'Microphone access denied';
      } else if (event.error === 'not-allowed') {
        errorMessage = language === 'hindi' ? 'माइक्रोफोन की अनुमति नहीं' : 'Microphone permission denied';
      }
      
      toast({
        title: t('voice.error') || 'Voice Error',
        description: errorMessage,
        variant: 'destructive',
      });
    };

    // Handle end
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    // Start recognition
    try {
      recognitionRef.current.start();
      toast({
        title: t('voice.listening') || 'Listening...',
        description: language === 'hindi' ? 'अब बोलें...' : 'Speak now...',
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      toast({
        title: t('voice.error') || 'Voice Error',
        description: 'Failed to start voice recognition',
        variant: 'destructive',
      });
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const actions = [
    {
      key: 'scan',
      icon: Camera,
      label: t('quickActions.scan') || 'Scan Crop',
      description: t('quickActions.scanDesc') || 'Detect diseases',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-600',
      action: () => handleAction('scan')
    },
    {
      key: 'voice',
      icon: Mic,
      label: t('quickActions.voice') || 'Voice Input',
      description: t('quickActions.voiceDesc') || 'Speak to search',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      action: () => handleAction('voice'),
      isActive: isListening
    },
    {
      key: 'chat',
      icon: MessageSquare,
      label: t('quickActions.chat') || 'Expert Chat',
      description: t('quickActions.chatDesc') || 'Get advice',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
      action: () => handleAction('chat')
    },
    {
      key: 'weather',
      icon: CloudRain,
      label: t('quickActions.weather') || 'Weather',
      description: t('quickActions.weatherDesc') || 'Check forecast',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-600',
      action: () => handleAction('weather')
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 rounded-full p-2">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gradient">
            {t('quickActions.title') || 'Quick Actions'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('quickActions.subtitle') || 'Access essential tools instantly'}
          </p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Card 
            key={action.key}
            className={`card-enhanced cursor-pointer group hover-scale transition-all duration-300 animate-slide-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={action.action}
          >
            <div className="p-4 text-center">
              {/* Icon Container */}
              <div className={`relative mb-3 ${action.bgColor} rounded-full w-16 h-16 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                {action.isActive ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse-slow" />
                ) : null}
                <action.icon className={`h-8 w-8 ${action.iconColor} relative z-10`} />
                
                {/* Active Indicator */}
                {action.isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-bounce-gentle">
                    <div className="w-full h-full bg-white rounded-full m-0.5" />
                  </div>
                )}
              </div>
              
              {/* Label */}
              <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                {action.label}
              </h4>
              
              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {action.description}
              </p>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>

      {/* Voice Input Status */}
      {isListening && (
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white text-center animate-pulse-slow">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce-gentle" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce-gentle" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce-gentle" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="font-medium">{t('voice.listening') || 'Listening...'}</p>
          <p className="text-sm opacity-80">{t('voice.speakNow') || 'Speak now...'}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={stopVoiceInput}
            className="mt-3 bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            {t('voice.stop') || 'Stop Listening'}
          </Button>
        </div>
      )}

      {/* Transcript Display */}
      {transcript && (
        <div className="bg-gradient-card rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('voice.detected') || 'Voice Detected'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{transcript}</p>
        </div>
      )}
    </div>
  );
};