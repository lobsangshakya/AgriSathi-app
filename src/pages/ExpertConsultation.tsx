import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  Phone, 
  Video, 
  ArrowLeft, 
  Clock, 
  Star,
  MessageCircle,
  User,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";

interface Expert {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  isOnline: boolean;
  avatar: string;
  languages: string[];
  consultationFee: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'expert';
  timestamp: Date;
  isTyping?: boolean;
}

const ExpertConsultation = () => {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  // Mock experts data
  const experts: Expert[] = [
    {
      id: '1',
      name: 'डॉ. राजेश कुमार',
      specialization: 'फसल रोग विज्ञान (Crop Disease Expert)',
      experience: '15+ वर्ष',
      rating: 4.8,
      isOnline: true,
      avatar: '',
      languages: ['हिंदी', 'English'],
      consultationFee: 50
    },
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      specialization: 'मिट्टी विज्ञान (Soil Science Expert)',
      experience: '12+ years',
      rating: 4.9,
      isOnline: true,
      avatar: '',
      languages: ['English', 'हिंदी'],
      consultationFee: 50
    },
    {
      id: '3',
      name: 'डॉ. अमित सिंह',
      specialization: 'कीट प्रबंधन (Pest Management Expert)',
      experience: '18+ वर्ष',
      rating: 4.7,
      isOnline: false,
      avatar: '',
      languages: ['हिंदी'],
      consultationFee: 50
    },
    {
      id: '4',
      name: 'Dr. Meera Patel',
      specialization: 'Organic Farming Expert',
      experience: '10+ years',
      rating: 4.6,
      isOnline: true,
      avatar: '',
      languages: ['English', 'हिंदी'],
      consultationFee: 50
    },
    {
      id: '5',
      name: 'डॉ. सुरेश वर्मा',
      specialization: 'उर्वरक विज्ञान (Fertilizer Expert)',
      experience: '20+ वर्ष',
      rating: 4.9,
      isOnline: true,
      avatar: '',
      languages: ['हिंदी', 'English'],
      consultationFee: 50
    },
    {
      id: '6',
      name: 'Dr. Anjali Reddy',
      specialization: 'Irrigation & Water Management',
      experience: '14+ years',
      rating: 4.5,
      isOnline: false,
      avatar: '',
      languages: ['English'],
      consultationFee: 50
    }
  ];

  // Session timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected && sessionTime > 0) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected, sessionTime]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const connectToExpert = async (expert: Expert) => {
    if (!user) {
      toast({
        title: t('expert.loginRequired') || 'Login Required',
        description: t('expert.pleaseLogin') || 'Please login to chat with experts',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSelectedExpert(expert);
      setIsConnected(true);
      setSessionTime(0);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: '1',
        text: language === 'hindi' 
          ? `नमस्ते! मैं ${expert.name} हूं, ${expert.specialization} में विशेषज्ञ। आपकी कैसे मदद कर सकता हूं?`
          : `Hello! I'm ${expert.name}, expert in ${expert.specialization}. How can I help you?`,
        sender: 'expert',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      
      toast({
        title: t('expert.connected') || 'Connected',
        description: t('expert.sessionStarted') || 'Expert consultation session started',
      });
      
    } catch (error) {
      toast({
        title: t('expert.connectionFailed') || 'Connection Failed',
        description: t('expert.tryAgain') || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedExpert) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate expert typing
    const typingMessage: Message = {
      id: 'typing',
      text: '',
      sender: 'expert',
      timestamp: new Date(),
      isTyping: true
    };

    setMessages(prev => [...prev, typingMessage]);

    // Simulate expert response
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      const expertResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateExpertResponse(newMessage),
        sender: 'expert',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, expertResponse]);
    }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
  };

  const generateExpertResponse = (userMessage: string): string => {
    const responses = {
      hindi: [
        'यह एक बहुत अच्छा सवाल है। मैं आपको विस्तार से बताता हूं...',
        'इस समस्या के लिए कुछ प्रभावी समाधान हैं...',
        'मैं आपकी फसल की स्थिति के अनुसार सलाह देता हूं...',
        'यह एक सामान्य समस्या है और इसे आसानी से हल किया जा सकता है...',
        'आपकी फसल के लिए यह उपचार सबसे उपयुक्त होगा...'
      ],
      english: [
        'That\'s a great question. Let me explain in detail...',
        'There are several effective solutions for this problem...',
        'I recommend based on your crop condition...',
        'This is a common issue and can be easily resolved...',
        'This treatment will be most suitable for your crop...'
      ]
    };

    const langResponses = responses[language as keyof typeof responses];
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const disconnect = () => {
    setIsConnected(false);
    setSelectedExpert(null);
    setMessages([]);
    setSessionTime(0);
    toast({
      title: t('expert.disconnected') || 'Disconnected',
      description: t('expert.sessionEnded') || 'Expert consultation session ended',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-earth flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Please log in to access expert consultation</h2>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header title={t('expert.title') || 'Expert Consultation'} />
      
      <div className="p-4 space-y-4">
        {!selectedExpert ? (
          // Expert Selection
          <div className="space-y-4">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                {t('expert.availableExperts') || 'Available Experts'}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {t('expert.selectExpert') || 'Select an expert to start consultation (50 AgriCreds per session)'}
              </p>
              
              <div className="space-y-3">
                {experts.map(expert => (
                  <Card key={expert.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={expert.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {expert.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{expert.name}</h3>
                          <Badge variant={expert.isOnline ? "default" : "secondary"}>
                            {expert.isOnline ? (t('expert.online') || 'Online') : (t('expert.offline') || 'Offline')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{expert.specialization}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{expert.experience}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{expert.rating}</span>
                          </div>
                          <span>{expert.languages.join(', ')}</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => connectToExpert(expert)}
                        disabled={!expert.isOnline || isConnecting}
                        className="min-w-[100px]"
                      >
                        {isConnecting ? (t('expert.connecting') || 'Connecting...') : (t('expert.connect') || 'Connect')}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          // Chat Interface
          <div className="space-y-4">
            {/* Expert Info Header */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedExpert.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {selectedExpert.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedExpert.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedExpert.specialization}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(sessionTime)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('expert.sessionTime') || 'Session'}</p>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={disconnect}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('expert.disconnect') || 'Disconnect'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Messages */}
            <Card className="p-4 h-96 overflow-y-auto">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.isTyping ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{t('expert.typing') || 'Expert is typing...'}</span>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{message.text}</p>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </Card>

            {/* Message Input */}
            <Card className="p-4">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('expert.typeMessage') || 'Type your message...'}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertConsultation; 