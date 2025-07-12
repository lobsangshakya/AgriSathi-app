import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  Mic, 
  Bot, 
  User, 
  Video,
  Clock,
  Star,
  MessageSquare,
  Camera,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiService, aiService, ChatMessage } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { CameraScanner } from "@/components/CameraScanner";

const Chat = () => {
  const { t, language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      content: language === 'hindi' 
        ? "नमस्ते! मैं AgriSathi AI हूं। आपकी खेती संबंधी किसी भी समस्या में आपकी मदद कर सकता हूं। आप हिंदी या अंग्रेजी में पूछ सकते हैं।"
        : "Hello! I'm AgriSathi AI. I can help you with any farming-related problems. You can ask in Hindi or English.",
      timestamp: new Date(),
      type: "text"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatContext, setChatContext] = useState<any>({});

  const experts = [
    {
      name: "डॉ. सुरेश कुमार",
      specialty: "पादप रोग विशेषज्ञ",
      rating: 4.8,
      available: true,
      price: "₹50/10 मिनट"
    },
    {
      name: "राज्या लक्ष्मी",
      specialty: "जैविक खेती सलाहकार",
      rating: 4.9,
      available: false,
      nextAvailable: "2:00 PM"
    }
  ];

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
      
      try {
        const nlpResult = await aiService.processNaturalLanguage(newMessage, language);
        const botResponse = await apiService.sendChatMessage(newMessage, {
          ...chatContext,
          language,
          nlpResult
        });
        
        setMessages(prev => [...prev, botResponse]);
        setChatContext(prev => ({ ...prev, lastMessage: newMessage }));
        
      } catch (error) {
        console.error('Chat error:', error);
        
        const fallbackMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: "bot",
          content: language === 'hindi' 
            ? "माफ़ करें, मैं आपके सवाल का जवाब नहीं दे पा रहा हूं। कृपया फिर से कोशिश करें।"
            : "Sorry, I couldn't process your question. Please try again.",
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

  const startVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setNewMessage(language === 'hindi' 
        ? "गेहूं की बुआई के लिए सबसे अच्छा समय कौन सा है?"
        : "What is the best time for wheat sowing?"
      );
    }, 3000);
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
      const analysis = await apiService.analyzeDisease(imageData);
      
      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        sender: "bot",
        content: language === 'hindi'
          ? `मैंने आपकी तस्वीर का विश्लेषण किया है।\n\nरोग: ${analysis.disease}\nआत्मविश्वास: ${analysis.confidence}%\nगंभीरता: ${analysis.severity}\n\nतुरंत कार्रवाई:\n${analysis.recommendations.slice(0, 3).map(rec => `• ${rec}`).join('\n')}`
          : `I've analyzed your image.\n\nDisease: ${analysis.disease}\nConfidence: ${analysis.confidence}%\nSeverity: ${analysis.severity}\n\nImmediate Actions:\n${analysis.recommendations.slice(0, 3).map(rec => `• ${rec}`).join('\n')}`,
        timestamp: new Date(),
        type: "text"
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Image analysis failed:', error);
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "bot",
        content: language === 'hindi'
          ? "माफ़ करें, मैं आपकी तस्वीर का विश्लेषण नहीं कर पाया। कृपया फिर से कोशिश करें।"
          : "Sorry, I couldn't analyze your image. Please try again.",
        timestamp: new Date(),
        type: "text"
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header title={t('chat.title')} />
      
      <div className="p-4 space-y-4">
        {/* Expert Consultation Banner */}
        <Card className="p-4 bg-gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">{t('chat.expertBanner')}</h3>
              <p className="text-sm opacity-90">{t('chat.expertSubtitle')}</p>
            </div>
            <Button variant="outline" size="sm" className="bg-white text-primary">
              <Video className="h-4 w-4 mr-2" />
              {t('chat.call')}
            </Button>
          </div>
        </Card>

        {/* Available Experts */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">{t('chat.availableExperts')}</h3>
          {experts.map((expert, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {expert.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{expert.name}</p>
                    <p className="text-sm text-muted-foreground">{expert.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-warning fill-current" />
                      <span className="text-xs">{expert.rating}</span>
                      {expert.price && (
                        <span className="text-xs text-success ml-2">{expert.price}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {expert.available ? (
                  <Button size="sm" variant="success">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {t('chat.chat')}
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">{t('chat.nextAvailable')}</p>
                    <p className="text-xs font-medium">{expert.nextAvailable}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={message.sender === 'bot' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}>
                    {message.sender === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <Card className={`p-3 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                  {message.type === 'image' ? (
                    <div>
                      <img 
                        src={message.content} 
                        alt="Uploaded image" 
                        className="w-full max-w-48 rounded mb-2"
                      />
                      <p className="text-xs opacity-80">
                        {language === 'hindi' ? 'तस्वीर भेजी गई' : 'Image sent'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 opacity-60" />
                    <span className="text-xs opacity-60">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="p-3 bg-card">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      {language === 'hindi' ? 'टाइप कर रहा है...' : 'Typing...'}
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Listening Indicator */}
        {isListening && (
          <Card className="p-4 text-center bg-accent/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">{t('chat.voiceListening')}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t('chat.speakQuestion')}</p>
          </Card>
        )}

        {/* Input Section */}
        <Card className="p-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startVoiceInput}
              disabled={isListening}
              className={isListening ? 'bg-red-100 text-red-600' : ''}
            >
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCameraOpen(true)}
              disabled={isTyping}
            >
              <Camera className="h-4 w-4" />
            </Button>
            
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('chat.writeQuestion')}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
              disabled={isTyping}
            />
            
            <Button onClick={sendMessage} disabled={!newMessage.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Quick Questions */}
        <div>
          <h4 className="font-medium text-foreground mb-2">{t('chat.commonQuestions')}</h4>
          <div className="flex flex-wrap gap-2">
            {[
              t('chat.weatherInfo'),
              t('chat.fertilizerAmount'),
              t('chat.seedTreatment'),
              t('chat.irrigationTime')
            ].map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                onClick={() => setNewMessage(question)}
                className="text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Camera Scanner */}
      <CameraScanner
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onImageCapture={handleCameraCapture}
      />
    </div>
  );
};

export default Chat;