import { useState } from "react";
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
  MessageSquare
} from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      content: "नमस्ते! मैं AgriSathi AI हूं। आपकी खेती संबंधी किसी भी समस्या में आपकी मदद कर सकता हूं। आप हिंदी या अंग्रेजी में पूछ सकते हैं।",
      time: "अभी",
      type: "text"
    },
    {
      id: 2,
      sender: "user",
      content: "मेरे टमाटर के पौधों में पीले धब्बे आ रहे हैं",
      time: "अभी",
      type: "text"
    },
    {
      id: 3,
      sender: "bot", 
      content: "टमाटर में पीले धब्बे आमतौर पर 'अर्ली ब्लाइट' या 'लेट ब्लाइट' की वजह से होते हैं। कुछ सवाल:\n\n1. धब्बे पत्तियों पर हैं या फलों पर भी?\n2. क्या धब्बों के चारों ओर भूरे रंग का घेरा है?\n3. पिछले कुछ दिनों में बारिश हुई है?\n\nतुरंत उपाय:\n• संक्रमित पत्तियों को हटा दें\n• कॉपर सल्फेट का छिड़काव करें\n• पानी सीधे पत्तियों पर न डालें",
      time: "अभी",
      type: "text"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

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

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        sender: "user" as const,
        content: newMessage,
        time: "अभी",
        type: "text" as const
      };
      
      setMessages([...messages, userMessage]);
      setNewMessage("");
      
      // Simulate bot response
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          sender: "bot" as const,
          content: "मैं आपके सवाल का विश्लेषण कर रहा हूं। कृपया थोड़ा इंतजार करें...",
          time: "अभी",
          type: "text" as const
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setNewMessage("गेहूं की बुआई के लिए सबसे अच्छा समय कौन सा है?");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header title="AI चैट सहायक" />
      
      <div className="p-4 space-y-4">
        {/* Expert Consultation Banner */}
        <Card className="p-4 bg-gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">विशेषज्ञ सलाह चाहिए?</h3>
              <p className="text-sm opacity-90">प्रमाणित कृषि विशेषज्ञों से बात करें</p>
            </div>
            <Button variant="outline" size="sm" className="bg-white text-primary">
              <Video className="h-4 w-4 mr-2" />
              कॉल करें
            </Button>
          </div>
        </Card>

        {/* Available Experts */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">उपलब्ध विशेषज्ञ</h3>
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
                    चैट
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">अगली बार</p>
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
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 opacity-60" />
                    <span className="text-xs opacity-60">{message.time}</span>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Voice Listening Indicator */}
        {isListening && (
          <Card className="p-4 text-center bg-accent/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">सुन रहा हूं...</span>
            </div>
            <p className="text-xs text-muted-foreground">अपना सवाल बोलें</p>
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
            
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="अपना सवाल लिखें..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Quick Questions */}
        <div>
          <h4 className="font-medium text-foreground mb-2">आम सवाल</h4>
          <div className="flex flex-wrap gap-2">
            {[
              "मौसम की जानकारी",
              "खाद की मात्रा",
              "बीज उपचार",
              "सिंचाई का समय"
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
    </div>
  );
};

export default Chat;