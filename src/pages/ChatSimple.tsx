/**
 * Simplified Chatbot Interface - Clean and Easy to Use
 * Focus on core functionality: ask questions, get answers
 */

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  Camera,
  MessageSquare
} from "lucide-react";
import { CameraScanner } from "@/components/CameraScanner";
import { chatbotService } from "@/services/chatbotService";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/utils/utils";

const ChatSimple = () => {
  const { language } = useLanguage();
  const { user } = useUser();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Quick questions for farmers
  const quickQuestions = language === 'hindi' ? [
    'मेरे टमाटर के पौधे पीले क्यों हैं?',
    'आज का मौसम कैसा है?',
    'गेहूं का भाव क्या है?',
    'फसल में कीड़ा लगने पर क्या करें?'
  ] : [
    'Why are my tomato plants turning yellow?',
    'What is the weather like today?',
    'What is the price of wheat?',
    'What to do if pests attack crops?'
  ];

  useEffect(() => {
    initializeSpeechRecognition();

    // Welcome message
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        content: language === 'hindi'
          ? '🌾 नमस्ते किसान भाई! मैं आपका कृषि सहायक हूं। अपना सवाल पूछें।'
          : '🌾 Hello! I am your farming assistant. Ask your question.',
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

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: language === 'hindi' ? 'आवाज़ समस्या' : 'Voice Issue',
          description: language === 'hindi'
            ? 'फिर से कोशिश करें'
            : 'Please try again',
          variant: 'destructive',
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Format history for the chatbot service
    const history = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    })) as { role: 'user' | 'assistant', content: string }[];

    try {
      const response = await chatbotService.processMessage(newMessage, {
        language,
        history
      });

      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: language === 'hindi'
          ? 'क्षमा करें, समस्या हुई। फिर से कोशिश करें।'
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
          ? 'आपके ब्राउज़र में आवाज़ सुविधा नहीं है'
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

  const handleQuickQuestion = (question: string) => {
    setNewMessage(question);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'hindi' ? 'कृषि सहायक' : 'Farming Assistant'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'hindi' ? 'अपना सवाल पूछें' : 'Ask your question'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
            >
              {language === 'hindi' ? 'वापस' : 'Back'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {language === 'hindi' ? 'त्वरित प्रश्न:' : 'Quick Questions:'}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="justify-start text-left h-auto p-3"
                >
                  <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-3 mb-4">
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              )}>
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'bot' && <Bot className="w-4 h-4 text-blue-600" />}
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
                  <Bot className="w-4 h-4 text-blue-600" />
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

        {/* Camera Scanner */}
        {showCamera && (
          <div className="mb-4">
            <CameraScanner
              isOpen={showCamera}
              onImageCapture={(imageData: string) => {
                const imageMessage = {
                  id: Date.now().toString(),
                  content: language === 'hindi'
                    ? '📸 फसल की फोटो भेजी गई।'
                    : '📸 Crop photo sent.',
                  sender: 'user',
                  timestamp: new Date(),
                  type: 'image'
                };
                setMessages(prev => [...prev, imageMessage]);
                setShowCamera(false);
              }}
              onClose={() => setShowCamera(false)}
            />
          </div>
        )}

        {/* Input Area */}
        <Card className="bg-white border-gray-200">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCamera(!showCamera)}
                className={cn(showCamera && "bg-blue-100 border-blue-300")}
              >
                <Camera className="w-4 h-4" />
              </Button>

              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={language === 'hindi'
                    ? 'अपना सवाल यहाँ लिखें...'
                    : 'Type your question here...'
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-2 text-xs text-gray-500 text-center">
              {language === 'hindi'
                ? '💡 टिप: फसल की फोटो भेजकर बीमारी की पहचान कर सकते हैं'
                : '💡 Tip: Send crop photos for disease detection'
              }
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatSimple;
