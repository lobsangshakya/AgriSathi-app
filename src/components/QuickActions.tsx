import { Camera, Mic, MessageSquare, MapPin, CloudRain, Coins } from "lucide-react";
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
            voiceInput: detectedText,
            language: language 
          } 
        });
      }, 1500);
    };

    // Handle errors
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = t('voice.error') || 'Voice recognition failed';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = language === 'hindi' 
            ? 'कोई आवाज नहीं सुनाई दी। कृपया फिर से बोलें।'
            : 'No speech detected. Please speak again.';
          break;
        case 'audio-capture':
          errorMessage = language === 'hindi'
            ? 'माइक्रोफोन तक पहुंच नहीं मिली। कृपया अनुमति दें।'
            : 'Microphone access denied. Please allow permission.';
          break;
        case 'not-allowed':
          errorMessage = language === 'hindi'
            ? 'माइक्रोफोन की अनुमति नहीं मिली।'
            : 'Microphone permission denied.';
          break;
        case 'network':
          errorMessage = language === 'hindi'
            ? 'नेटवर्क त्रुटि। कृपया इंटरनेट कनेक्शन जांचें।'
            : 'Network error. Please check internet connection.';
          break;
      }

      toast({
        title: t('voice.error') || 'Voice Error',
        description: errorMessage,
        variant: 'destructive',
      });
    };

    // Handle end of recognition
    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (!transcript) {
        toast({
          title: t('voice.noInput') || 'No Input',
          description: language === 'hindi' 
            ? 'कोई आवाज नहीं सुनाई दी। कृपया फिर से कोशिश करें।'
            : 'No voice detected. Please try again.',
          variant: 'destructive',
        });
      }
    };

    // Start recognition
    try {
      console.log('Starting speech recognition...');
      recognitionRef.current.start();
      console.log('Speech recognition started successfully');
      toast({
        title: t('voice.listening') || 'Listening...',
        description: language === 'hindi' 
          ? 'अपना सवाल बोलें...'
          : 'Speak your question...',
      });
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      toast({
        title: t('voice.error') || 'Voice Error',
        description: t('voice.startFailed') || 'Failed to start voice recognition',
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

  // Test function for debugging
  const testVoiceInput = () => {
    const testText = language === 'hindi' 
      ? 'गेहूं की बुआई के लिए सबसे अच्छा समय कौन सा है?'
      : 'What is the best time for wheat sowing?';
    
    setTranscript(testText);
    toast({
      title: 'Test Voice Input',
      description: testText,
      variant: 'default',
    });
    
    setTimeout(() => {
      navigate('/chat', { 
        state: { 
          voiceInput: testText,
          language: language 
        } 
      });
    }, 1500);
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
      
      {/* Voice Input Status */}
      {isListening && (
        <Card className="mt-4 p-4 bg-gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 animate-pulse" />
              <span className="font-medium">
                {language === 'hindi' ? 'सुन रहा हूं...' : 'Listening...'}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={stopVoiceInput}
              className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              {language === 'hindi' ? 'रोकें' : 'Stop'}
            </Button>
          </div>
          {transcript && (
            <p className="text-sm mt-2 opacity-90">
              {language === 'hindi' ? 'पहचाना गया: ' : 'Detected: '}{transcript}
            </p>
          )}
        </Card>
      )}
      
      {/* Debug Info */}
      <Card className="mt-2 p-2 bg-muted/50">
        <div className="text-xs text-muted-foreground">
          <p>Secure Context: {window.isSecureContext ? 'Yes' : 'No'}</p>
          <p>Webkit Speech: {'webkitSpeechRecognition' in window ? 'Yes' : 'No'}</p>
          <p>Speech Recognition: {'SpeechRecognition' in window ? 'Yes' : 'No'}</p>
          <p>Current Language: {language}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={testVoiceInput}
          className="mt-2 w-full"
        >
          Test Voice Input
        </Button>
      </Card>
      
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