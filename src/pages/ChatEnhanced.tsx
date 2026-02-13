/**
 * Enhanced Chat Interface with Clear Instructions and Examples
 * Designed for farmers with intuitive UX and helpful prompts
 */

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
  Info,
  Lightbulb,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { CameraScanner } from "@/components/CameraScanner";
import { apiService, aiService, compressImage, DiseaseAnalysisResult, ChatMessage, ChatContext } from "@/services/api";
import { workingChatbot } from "@/services/workingChatbot";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { cn } from "@/utils/utils";

const ChatEnhanced = () => {
  const { t, language } = useLanguage();
  const { user, updateStats } = useUser();
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [chatContext, setChatContext] = useState<ChatContext>({ 
    language,
    lastMessage: ''
  });
  const [apiStatus, setApiStatus] = useState<'mock' | 'real' | 'error'>('mock');
  const [showExamples, setShowExamples] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Example questions for farmers
  const exampleQuestions = language === 'hindi' ? [
    {
      category: 'फसल स्वास्थ्य',
      questions: [
        'मेरे टमाटर के पौधे पीले क्यों हो रहे हैं?',
        'गेहूं में कीड़ा लगने पर क्या करें?',
        'धान की फसल में पानी कितना दें?'
      ]
    },
    {
      category: 'मौसम और खेती',
      questions: [
        'बारिश के बाद कब खेती करनी चाहिए?',
        'गर्मी में कौन सी फसल अच्छी होगी?',
        'सिंचाई का सबसे अच्छा समय क्या है?'
      ]
    },
    {
      category: 'बाजार और कीमत',
      questions: [
        'आज टमाटर का भाव क्या है?',
        'सब्जियों का बाजार कैसा है?',
        'कौन सी फसल अभी अच्छी बिक रही है?'
      ]
    },
    {
      category: 'खाद और दवाई',
      questions: [
        'गेहूं के लिए कौन सा खाद बेहतर है?',
        'कीटनाशक का सही तरीका क्या है?',
        'जैविक खेती कैसे शुरू करें?'
      ]
    }
  ] : [
    {
      category: 'Crop Health',
      questions: [
        'Why are my tomato plants turning yellow?',
        'What to do for pest attack in wheat?',
        'How much water to give rice crop?'
      ]
    },
    {
      category: 'Weather & Farming',
      questions: [
        'When to farm after rain?',
        'Which crop is good in summer?',
        'What is the best time for irrigation?'
      ]
    },
    {
      category: 'Market & Prices',
      questions: [
        'What is tomato price today?',
        'How is vegetable market?',
        'Which crop is selling well now?'
      ]
    },
    {
      category: 'Fertilizers & Medicine',
      questions: [
        'Which fertilizer is best for wheat?',
        'What is the right way to use pesticide?',
        'How to start organic farming?'
      ]
    }
  ];

  // Quick help options
  const quickHelpOptions = language === 'hindi' ? [
    { icon: Camera, label: 'फसल की फोटो भेजें', desc: 'बीमारी की पहचान' },
    { icon: MessageSquare, label: 'विशेषज्ञ से बात करें', desc: 'तुरंत सलाह' },
    { icon: HelpCircle, label: 'खेती गाइड', desc: 'स्टेप-बाय-स्टेप' },
    { icon: RefreshCw, label: 'मौसम अपडेट', desc: 'आज का मौसम' }
  ] : [
    { icon: Camera, label: 'Send Crop Photo', desc: 'Disease detection' },
    { icon: MessageSquare, label: 'Talk to Expert', desc: 'Instant advice' },
    { icon: HelpCircle, label: 'Farming Guide', desc: 'Step-by-step' },
    { icon: RefreshCw, label: 'Weather Update', desc: "Today's weather" }
  ];

  useEffect(() => {
    checkApiStatus();
    initializeSpeechRecognition();
    
    // Welcome message
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: language === 'hindi' 
          ? ' नमस्ते! मैं आपका कृषि सहायक हूं। मैं आपकी फसलों, मौसम, बाजार और खेती से जुड़े सभी सवालों का जवाब दे सकता हूं। क्या जानना चाहते हैं?'
          : ' Hello! I am your farming assistant. I can help you with crops, weather, market, and all farming-related questions. What would you like to know?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'hindi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: language === 'hindi' ? 'आवाज़ समस्या' : 'Voice Issue',
          description: language === 'hindi' 
            ? 'आवाज़ सुनने में समस्या है, फिर से कोशिश करें' 
            : 'Could not hear voice, please try again',
          variant: 'destructive',
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const checkApiStatus = async () => {
    try {
      // Simple API check - just try to call a basic method
      await apiService.getWeatherData(28.6139, 77.2090);
      setApiStatus('real');
    } catch (error) {
      setApiStatus('mock');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setShowExamples(false);
    setNewMessage('');
    setIsTyping(true);

    try {
      // Use working chatbot for intelligent responses
      const response = await workingChatbot.processMessage(newMessage, chatContext);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botMessage]);
      setChatContext({
        language,
        lastMessage: newMessage
      });

      // Update user stats
      if (user) {
        updateStats('answer');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: language === 'hindi' 
          ? 'क्षमा करें, समस्या हुई। कृपया फिर से कोशिश करें।' 
          : 'Sorry, there was a problem. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: language === 'hindi' ? 'आवाज़ उपलब्ध नहीं' : 'Voice Not Available',
        description: language === 'hindi' 
          ? 'आपके ब्राउज़र में आवाज़ सुविधा उपलब्ध नहीं है' 
          : 'Voice feature is not available in your browser',
        variant: 'destructive',
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleExampleClick = (question: string) => {
    setNewMessage(question);
    setShowExamples(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header title={language === 'hindi' ? 'कृषि विशेषज्ञ' : 'Farming Expert'} />
      
      <div className="max-w-md mx-auto px-4 py-6 pb-32">
        {/* Status Bar */}
        <Card className="mb-4 bg-gradient-to-r from-green-100 to-emerald-100 border-green-200">
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                {language === 'hindi' ? 'कृषि विशेषज्ञ' : 'Farming Expert'}
              </span>
              <Badge variant="secondary" className="text-xs">
                {apiStatus === 'real' 
                  ? (language === 'hindi' ? 'ऑनलाइन' : 'Online') 
                  : (language === 'hindi' ? 'ऑफलाइन' : 'Offline')
                }
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={checkApiStatus}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Help Options */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {language === 'hindi' ? 'त्वरित सहायता' : 'Quick Help'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickHelpOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-auto p-3 justify-start"
                    onClick={() => {
                      if (option.label.includes('फसल') || option.label.includes('Crop')) {
                        setShowCamera(true);
                      } else {
                        setNewMessage(option.label);
                        setShowExamples(false);
                      }
                    }}
                  >
                    <Icon className="w-4 h-4 mr-2 text-green-600" />
                    <div className="text-left">
                      <div className="text-xs font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.desc}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Example Questions */}
        {showExamples && messages.length <= 1 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <h3 className="text-sm font-semibold text-gray-700">
                {language === 'hindi' ? 'इन सवालों के बारे में पूछें:' : 'Ask about these questions:'}
              </h3>
            </div>
            <div className="space-y-3">
              {exampleQuestions.map((category, catIndex) => (
                <div key={catIndex}>
                  <h4 className="text-xs font-medium text-gray-600 mb-2">{category.category}</h4>
                  <div className="space-y-1">
                    {category.questions.map((question, qIndex) => (
                      <Button
                        key={`${catIndex}-${qIndex}`}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-2 hover:bg-green-50"
                        onClick={() => handleExampleClick(question)}
                      >
                        <span className="text-xs">{question}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              )}>
                <div className="flex items-start gap-2 mb-1">
                  {message.sender === 'bot' && <Bot className="w-4 h-4 text-green-600" />}
                  {message.sender === 'user' && <User className="w-4 h-4" />}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-green-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <Card className="bg-white border-gray-200 shadow-lg">
          <div className="p-4">
            {/* Camera Scanner */}
            {showCamera && (
              <div className="mb-4">
                <CameraScanner
                  isOpen={showCamera}
                  onImageCapture={(imageData: string) => {
                    // Handle image capture for crop analysis
                    const imageMessage: ChatMessage = {
                      id: Date.now().toString(),
                      content: language === 'hindi' 
                        ? ' फसल की फोटो भेजी गई। कृपया बीमारी के लक्षण बताएं।' 
                        : ' Crop photo sent. Please describe the disease symptoms.',
                      sender: 'user',
                      timestamp: new Date(),
                      type: 'image'
                    };
                    setMessages(prev => [...prev, imageMessage]);
                    setShowCamera(false);
                    setShowExamples(false);
                  }}
                  onClose={() => setShowCamera(false)}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCamera(!showCamera)}
                className={cn(showCamera && "bg-green-100 border-green-300")}
              >
                <Camera className="w-4 h-4" />
              </Button>

              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={language === 'hindi' 
                    ? 'अपना सवाल यहाँ लिखें या बोलें...' 
                    : 'Type or speak your question here...'
                  }
                  className="pr-12"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={cn(
                    "absolute right-1 top-1",
                    isListening && "bg-red-100 text-red-600"
                  )}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-2 text-xs text-gray-500 text-center">
              {language === 'hindi' 
                ? ' टिप: फसल की फोटो भेजकर बीमारी की पहचान कर सकते हैं' 
                : ' Tip: Send crop photos for disease detection'
              }
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatEnhanced;
