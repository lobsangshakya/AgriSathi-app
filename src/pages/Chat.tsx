import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Camera, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  RefreshCw, 
  Trash2,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { CameraScanner } from "@/components/CameraScanner";
import { apiService, aiService, ChatMessage, ChatContext } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

const Chat = () => {
  const { t, language } = useLanguage();
  const { user, updateStats } = useUser();
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [chatContext, setChatContext] = useState<ChatContext>({ 
    language,
    lastMessage: ''
  });
  const [apiStatus, setApiStatus] = useState<'mock' | 'real' | 'error'>('mock');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  // Update chat context when language changes
  useEffect(() => {
    setChatContext(prev => ({ ...prev, language }));
  }, [language]);

  // Handle voice input from QuickActions
  useEffect(() => {
    if (location.state?.voiceInput) {
      const voiceInput = location.state.voiceInput;
      setNewMessage(voiceInput);
      
      // Show toast for voice input
      toast({
        title: t('voice.inputReceived') || 'Voice Input Received',
        description: voiceInput,
        variant: 'default',
      });
      
      // Clear the state to prevent re-processing
      window.history.replaceState({}, document.title);
    }
  }, [location.state, t]);

  const checkApiStatus = async () => {
    try {
      // Try to get weather data to test if real APIs are working
      const testResponse = await apiService.sendChatMessage("test", { language });
      setApiStatus('real');
    } catch (error) {
      console.log('Using mock APIs for development');
      setApiStatus('mock');
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "user",
        content: newMessage,
        timestamp: new Date(),
        type: "text"
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage("");
      setIsTyping(true);
      
      // Add AgriCreds for asking a question
      if (user) {
        updateStats('question');
      }
      
      try {
        // Debug: Log the current language
        console.log('Current language:', language);
        console.log('Chat context:', chatContext);
        
        // Process with NLP first
        const nlpResult = await aiService.processNaturalLanguage(newMessage, language);
        
        // Create the context with explicit language
        const messageContext = {
          ...chatContext,
          language: language, // Explicitly set language
          nlpResult
        };
        
        console.log('Sending message with context:', messageContext);
        
        // Send to chatbot API with proper language context
        const botResponse = await apiService.sendChatMessage(newMessage, messageContext);
        
        console.log('Bot response received:', botResponse);
        
        setMessages(prev => [...prev, botResponse]);
        setChatContext(prev => ({ ...prev, lastMessage: newMessage, language }));
        
        // Show success toast for real API usage
        if (apiStatus === 'real') {
          toast({
            title: t('chat.responseReceived') || 'Response Received',
            description: t('chat.usingRealData') || 'Using real agricultural data',
            variant: 'default',
          });
        }
      
      } catch (error) {
        console.error('Chat error:', error);
        
        const fallbackMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: "bot",
          content: language === 'hindi' 
            ? "माफ़ करें, मैं आपके सवाल का जवाब नहीं दे पा रहा हूं। कृपया फिर से कोशिश करें।\n\nआप इन विषयों पर पूछ सकते हैं:\n• फसल (टमाटर, गेहूं, धान, मक्का)\n• मौसम और जलवायु\n• खाद और पोषण\n• कीट और रोग नियंत्रण\n• सिंचाई तरीके\n• जैविक खेती\n• बाजार भाव\n• सरकारी योजनाएं"
            : "Sorry, I couldn't process your question. Please try again.\n\nYou can ask about:\n• Crops (tomato, wheat, rice, maize)\n• Weather and climate\n• Fertilizers and nutrition\n• Pest and disease control\n• Irrigation methods\n• Organic farming\n• Market rates\n• Government schemes",
          timestamp: new Date(),
          type: "text"
        };
        
        setMessages(prev => [...prev, fallbackMessage]);
        
        toast({
          title: t('common.error') || 'Error',
          description: t('chat.error') || 'Failed to get response',
          variant: 'destructive',
        });
      } finally {
        setIsTyping(false);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: t('voice.notSupported') || 'Voice Not Supported',
        description: t('voice.browserSupport') || 'Your browser does not support speech recognition',
        variant: 'destructive',
      });
      return;
    }

    setIsListening(true);

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
      const result = event.results[0];
      const detectedText = result[0].transcript;
      setNewMessage(detectedText);

      toast({
        title: t('voice.detected') || 'Voice Detected',
        description: detectedText,
        variant: 'default',
      });
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
    };

    // Start recognition
    try {
      recognitionRef.current.start();
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

  const handleCameraCapture = (imageData: string) => {
    const imageMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: imageData,
      timestamp: new Date(),
      type: "image"
    };
    
    setMessages(prev => [...prev, imageMessage]);
    setIsCameraOpen(false);
    analyzeImageForChat(imageData);
  };

  const analyzeImageForChat = async (imageData: string) => {
    setIsTyping(true);
    
    try {
      const analysisResult = await apiService.analyzeDisease(imageData);
      
      const analysisMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "bot",
        content: language === 'hindi'
          ? `छवि विश्लेषण परिणाम:\n\nपौधा: ${analysisResult.disease}\nविश्वास: ${analysisResult.confidence}%\nगंभीरता: ${analysisResult.severity}\n\nसिफारिशें:\n${analysisResult.recommendations.map(rec => `• ${rec}`).join('\n')}\n\nरोकथाम:\n${analysisResult.preventiveMeasures.map(prev => `• ${prev}`).join('\n')}`
          : `Image Analysis Result:\n\nPlant: ${analysisResult.disease}\nConfidence: ${analysisResult.confidence}%\nSeverity: ${analysisResult.severity}\n\nRecommendations:\n${analysisResult.recommendations.map(rec => `• ${rec}`).join('\n')}\n\nPrevention:\n${analysisResult.preventiveMeasures.map(prev => `• ${prev}`).join('\n')}`,
        timestamp: new Date(),
        type: "text"
      };
      
      setMessages(prev => [...prev, analysisMessage]);
      
    } catch (error) {
      console.error('Image analysis error:', error);
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "bot",
        content: language === 'hindi'
          ? "माफ़ करें, छवि का विश्लेषण नहीं कर पा रहा हूं। कृपया फिर से कोशिश करें।"
          : "Sorry, I couldn't analyze the image. Please try again.",
        timestamp: new Date(),
        type: "text"
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setChatContext({ language, lastMessage: '' });
    toast({
      title: t('chat.cleared') || 'Chat Cleared',
      description: t('chat.startNewConversation') || 'Start a new conversation',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'hindi' ? 'hi-IN' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWelcomeMessage = () => {
    const today = new Date().toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return language === 'hindi'
      ? `नमस्ते! मैं AgriSathi AI हूं।\nआज: ${today}\n\nआप इन विषयों पर पूछ सकते हैं:\n• फसल (टमाटर, गेहूं, धान, मक्का)\n• मौसम और जलवायु\n• खाद और पोषण\n• कीट और रोग नियंत्रण\n• सिंचाई तरीके\n• जैविक खेती\n• बाजार भाव\n• सरकारी योजनाएं\n\nतस्वीर भेजकर रोग की पहचान भी कर सकते हैं!\n\nभाषा बदलने के लिए ऊपर दाईं तरफ का बटन दबाएं।`
      : `Hello! I'm AgriSathi AI.\nToday: ${today}\n\nYou can ask about:\n• Crops (tomato, wheat, rice, maize)\n• Weather and climate\n• Fertilizers and nutrition\n• Pest and disease control\n• Irrigation methods\n• Organic farming\n• Market rates\n• Government schemes\n\nYou can also send photos to identify diseases!\n\nClick the button on the top right to change language.`;
  };

  // Initialize with welcome message if no messages
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        sender: 'bot',
        content: getWelcomeMessage(),
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, [language, messages.length]);

  // Debug: Log language changes
  useEffect(() => {
    console.log('Language changed to:', language);
    console.log('Chat context updated:', chatContext);
  }, [language, chatContext]);

  // Test function to verify language switching
  const testLanguageSwitch = async () => {
    console.log('Testing language switch...');
    try {
      const testResponse = await apiService.sendChatMessage("hello", { language });
      console.log('Test response:', testResponse);
      toast({
        title: 'Language Test',
        description: `Response in ${language}: ${testResponse.content.substring(0, 50)}...`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header title={t('chat.title')} />
      
      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* API Status Indicator */}
        <div className="p-2 bg-card/50 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {apiStatus === 'real' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : apiStatus === 'mock' ? (
                <Info className="h-4 w-4 text-yellow-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs">
                {apiStatus === 'real' 
                  ? t('chat.usingRealData') || 'Using Real APIs'
                  : apiStatus === 'mock'
                  ? t('chat.usingMockData') || 'Using Mock Data'
                  : t('chat.apiError') || 'API Error'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Debug: Language indicator */}
              <span className="text-xs bg-primary/20 px-2 py-1 rounded">
                {language === 'hindi' ? 'हिंदी' : 'English'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={testLanguageSwitch}
                className="gap-1 text-xs"
              >
                Test
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="gap-1 text-xs"
              >
                <Trash2 className="h-3 w-3" />
                {t('chat.clear') || 'Clear'}
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground border border-border'
                }`}>
                  {message.type === 'image' ? (
                    <img 
                      src={message.content} 
                      alt="Plant" 
                      className="max-w-full h-auto rounded"
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  )}
                  <div className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-card text-foreground border border-border rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {t('chat.typing') || 'Typing...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card/50 backdrop-blur-sm border-t border-border">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCameraOpen(true)}
              className="flex-shrink-0"
            >
              <Camera className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              className={`flex-shrink-0 ${isListening ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={t('chat.placeholder') || "Type your message..."}
              className="flex-1"
              disabled={isTyping}
            />
            
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isTyping}
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Camera Scanner Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-background rounded-lg p-4 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {t('diseaseDetection.scanPlant') || 'Scan Plant'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCameraOpen(false)}
              >
                ×
              </Button>
            </div>
            <CameraScanner
              onImageCapture={handleCameraCapture}
              onClose={() => setIsCameraOpen(false)}
              isOpen={isCameraOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;