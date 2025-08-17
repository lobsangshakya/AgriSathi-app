import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  MessageCircle, 
  Camera, 
  Users, 
  TrendingUp, 
  Leaf,
  Star,
  Gift,
  Coins,
  Wallet
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import React from "react";

export default function AgriCredits() {
  const { language, t } = useLanguage();
  const { user, addAgriCreds } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if user came from expert chat
  const fromExpertChat = location.state?.fromExpertChat;

  const services = [
    {
      id: 'expert-chat',
      name: language === 'hindi' ? 'विशेषज्ञ से बात' : 'Expert Chat',
      description: language === 'hindi' ? 'कृषि विशेषज्ञ से सीधी बातचीत' : 'Direct chat with agriculture expert',
      credits: 50,
      icon: MessageCircle,
      color: 'bg-blue-500'
    },
    {
      id: 'voice-call',
      name: language === 'hindi' ? 'वॉइस कॉल' : 'Voice Call',
      description: language === 'hindi' ? 'विशेषज्ञ से फोन पर बात' : 'Phone call with expert',
      credits: 100,
      icon: Phone,
      color: 'bg-green-500'
    },
    {
      id: 'disease-detection',
      name: language === 'hindi' ? 'रोग पहचान' : 'Disease Detection',
      description: language === 'hindi' ? 'फसल रोग की पहचान' : 'Crop disease identification',
      credits: 25,
      icon: Camera,
      color: 'bg-orange-500'
    },
    {
      id: 'soil-analysis',
      name: language === 'hindi' ? 'मिट्टी जांच' : 'Soil Analysis',
      description: language === 'hindi' ? 'मिट्टी की गुणवत्ता जांच' : 'Soil quality analysis',
      credits: 30,
      icon: Leaf,
      color: 'bg-purple-500'
    }
  ];

  const handleServiceClick = (service: any) => {
    if (user.agriCreds >= service.credits) {
      addAgriCreds(-service.credits, `Used ${service.name}`);
      toast({
        title: language === 'hindi' ? 'सेवा शुरू की गई' : 'Service Started',
        description: language === 'hindi' 
          ? `${service.name} सेवा शुरू की गई। ${service.credits} क्रेडिट खर्च हुए।`
          : `${service.name} service started. ${service.credits} credits spent.`,
      });
      
      // Navigate to appropriate page based on service
      switch (service.id) {
        case 'expert-chat':
          navigate('/chat');
          break;
        case 'voice-call':
          // Navigate to voice call page or show call interface
          break;
        case 'disease-detection':
          navigate('/disease-detection');
          break;
        case 'soil-analysis':
          // Navigate to soil analysis page
          break;
      }
    } else {
      toast({
        title: language === 'hindi' ? 'अपर्याप्त क्रेडिट' : 'Insufficient Credits',
        description: language === 'hindi' 
          ? `आपके पास पर्याप्त क्रेडिट नहीं हैं। ${service.credits} क्रेडिट की आवश्यकता है।`
          : `You don't have enough credits. ${service.credits} credits required.`,
        variant: "destructive",
      });
    }
  };

  const earningMethods = [
    {
      id: 'daily-login',
      name: language === 'hindi' ? 'दैनिक लॉगिन' : 'Daily Login',
      credits: 10,
      icon: Star,
      description: language === 'hindi' ? 'रोज लॉगिन करें' : 'Login daily'
    },
    {
      id: 'community-post',
      name: language === 'hindi' ? 'समुदाय पोस्ट' : 'Community Post',
      credits: 15,
      icon: Users,
      description: language === 'hindi' ? 'समुदाय में पोस्ट करें' : 'Post in community'
    },
    {
      id: 'refer-friend',
      name: language === 'hindi' ? 'दोस्त को भेजें' : 'Refer Friend',
      credits: 50,
      icon: Gift,
      description: language === 'hindi' ? 'दोस्त को ऐप भेजें' : 'Refer app to friend'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header title={language === 'hindi' ? 'AgriCredits' : 'AgriCredits'} />
      
      <div className="p-4 space-y-6">
        {/* Credits Display */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Coins className="h-8 w-8" />
              <span className="text-3xl font-bold">{user.agriCreds}</span>
            </div>
            <p className="text-lg opacity-90">
              {language === 'hindi' ? 'आपके AgriCredits' : 'Your AgriCredits'}
            </p>
          </CardContent>
        </Card>

        {/* Expert Chat Banner */}
        {fromExpertChat && (
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">
                    {language === 'hindi' ? 'विशेषज्ञ चैट' : 'Expert Chat'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {language === 'hindi' 
                      ? '50 क्रेडिट की आवश्यकता है' 
                      : 'Requires 50 credits'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {language === 'hindi' ? 'उपलब्ध सेवाएं' : 'Available Services'}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {services.map((service) => {
              const IconComponent = service.icon;
              const canAfford = user.agriCreds >= service.credits;
              
              return (
                <Card 
                  key={service.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    canAfford ? 'hover:scale-105' : 'opacity-60'
                  }`}
                  onClick={() => handleServiceClick(service)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${service.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={canAfford ? "default" : "secondary"}>
                          {service.credits} {language === 'hindi' ? 'क्रेडिट' : 'Credits'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How to Earn */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {language === 'hindi' ? 'क्रेडिट कैसे कमाएं' : 'How to Earn Credits'}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {earningMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Card key={method.id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <IconComponent className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{method.name}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        +{method.credits}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/wallet')}
            className="h-12"
          >
            <Wallet className="h-4 w-4 mr-2" />
            {language === 'hindi' ? 'वॉलेट' : 'Wallet'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="h-12"
          >
            {language === 'hindi' ? 'वापस जाएं' : 'Go Back'}
          </Button>
        </div>
      </div>
    </div>
  );
} 