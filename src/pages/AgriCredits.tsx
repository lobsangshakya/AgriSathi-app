import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, 
  Phone, 
  MessageCircle, 
  Video, 
  FileText, 
  MapPin, 
  Clock, 
  Users,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

const AgriCredits = () => {
  const { t } = useLanguage();
  const { user, addAgriCreds } = useUser();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-earth flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Please log in to view AgriCreds</h2>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const services = [
    {
      id: 'expert-chat',
      title: t('agriCredits.expertChat.title') || 'Expert Chat Consultation',
      description: t('agriCredits.expertChat.description') || 'Chat with Dr. Rajesh Kumar (Crop Disease), Dr. Priya Sharma (Soil Science), Dr. Amit Singh (Pest Management), Dr. Meera Patel (Organic Farming), Dr. Suresh Verma (Fertilizer), Dr. Anjali Reddy (Irrigation)',
      cost: 50,
      icon: MessageCircle,
      duration: '30 min',
      features: [
        t('agriCredits.expertChat.feature1') || 'Real-time chat with 6 specialized experts',
        t('agriCredits.expertChat.feature2') || 'Crop disease diagnosis & treatment',
        t('agriCredits.expertChat.feature3') || 'Soil analysis & fertilizer recommendations',
        t('agriCredits.expertChat.feature4') || 'Pest management & organic solutions'
      ]
    },
    {
      id: 'video-call',
      title: t('agriCredits.videoCall.title') || 'Video Call Consultation',
      description: t('agriCredits.videoCall.description') || 'Face-to-face consultation with agricultural experts',
      cost: 100,
      icon: Video,
      duration: '45 min',
      features: [
        t('agriCredits.videoCall.feature1') || 'Video call with experts',
        t('agriCredits.videoCall.feature2') || 'Visual problem diagnosis',
        t('agriCredits.videoCall.feature3') || 'Detailed farm analysis'
      ]
    },
    {
      id: 'soil-test',
      title: t('agriCredits.soilTest.title') || 'Soil Testing Service',
      description: t('agriCredits.soilTest.description') || 'Professional soil analysis and recommendations',
      cost: 75,
      icon: FileText,
      duration: '3-5 days',
      features: [
        t('agriCredits.soilTest.feature1') || 'Comprehensive soil analysis',
        t('agriCredits.soilTest.feature2') || 'Nutrient recommendations',
        t('agriCredits.soilTest.feature3') || 'Detailed report'
      ]
    },
    {
      id: 'farm-visit',
      title: t('agriCredits.farmVisit.title') || 'Farm Visit Consultation',
      description: t('agriCredits.farmVisit.description') || 'Expert visit to your farm for on-site analysis',
      cost: 200,
      icon: MapPin,
      duration: '2-3 hours',
      features: [
        t('agriCredits.farmVisit.feature1') || 'Expert farm visit',
        t('agriCredits.farmVisit.feature2') || 'On-site problem diagnosis',
        t('agriCredits.farmVisit.feature3') || 'Comprehensive farm plan'
      ]
    },
    {
      id: 'group-session',
      title: t('agriCredits.groupSession.title') || 'Group Learning Session',
      description: t('agriCredits.groupSession.description') || 'Join group sessions with other farmers and experts',
      cost: 25,
      icon: Users,
      duration: '60 min',
      features: [
        t('agriCredits.groupSession.feature1') || 'Group learning sessions',
        t('agriCredits.groupSession.feature2') || 'Peer farmer interaction',
        t('agriCredits.groupSession.feature3') || 'Expert-led discussions'
      ]
    },
    {
      id: 'emergency-call',
      title: t('agriCredits.emergencyCall.title') || 'Emergency Phone Call',
      description: t('agriCredits.emergencyCall.description') || 'Immediate phone consultation for urgent issues',
      cost: 150,
      icon: Phone,
      duration: '15 min',
      features: [
        t('agriCredits.emergencyCall.feature1') || 'Immediate expert call',
        t('agriCredits.emergencyCall.feature2') || 'Urgent problem solving',
        t('agriCredits.emergencyCall.feature3') || '24/7 availability'
      ]
    }
  ];

  const handleRedeem = async (service: typeof services[0]) => {
    if (user.agriCreds < service.cost) {
      toast({
        title: t('agriCredits.insufficientCredits') || 'Insufficient Credits',
        description: t('agriCredits.needMoreCredits') || `You need ${service.cost} AgriCreds for this service`,
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Deduct credits
      addAgriCreds(-service.cost, service.title);
      
      toast({
        title: t('agriCredits.redemptionSuccess') || 'Redemption Successful',
        description: t('agriCredits.serviceBooked') || `${service.title} has been booked!`,
      });

      // Navigate based on service type
      setTimeout(() => {
        if (service.id === 'expert-chat') {
          navigate('/expert-consultation');
        } else if (service.id === 'video-call') {
          navigate('/video-consultation');
        } else {
          // For other services, show confirmation
          navigate('/service-confirmation', { 
            state: { service: service.title, cost: service.cost }
          });
        }
      }, 1000);
      
    } catch (error) {
      toast({
        title: t('agriCredits.redemptionError') || 'Redemption Failed',
        description: t('agriCredits.tryAgain') || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header title={t('agriCredits.title') || 'AgriCreds Redemption'} />
      
      <div className="p-4 space-y-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/profile')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('agriCredits.backToProfile') || 'Back to Profile'}
        </Button>

        {/* Credits Display */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Coins className="h-8 w-8" />
            <span className="text-3xl font-bold">₹{user.agriCreds}</span>
          </div>
          <p className="text-lg opacity-90">
            {t('agriCredits.availableCredits') || 'Available AgriCreds'}
          </p>
          <p className="text-sm opacity-75 mt-2">
            {t('agriCredits.earnMore') || 'Earn more by participating in the community!'}
          </p>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => {
            const IconComponent = service.icon;
            const canAfford = user.agriCreds >= service.cost;
            
            return (
              <Card 
                key={service.id} 
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedService === service.id ? 'ring-2 ring-primary' : ''
                } ${!canAfford ? 'opacity-60' : ''}`}
                onClick={() => setSelectedService(service.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <Badge variant={canAfford ? "default" : "secondary"}>
                    ₹{service.cost}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration}</span>
                  </div>

                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full mt-4"
                    disabled={!canAfford || isProcessing}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRedeem(service);
                    }}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {t('agriCredits.processing') || 'Processing...'}
                      </div>
                    ) : canAfford ? (
                      t('agriCredits.redeem') || 'Redeem Now'
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {t('agriCredits.insufficient') || 'Insufficient Credits'}
                      </div>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* How to Earn More */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">
            {t('agriCredits.howToEarn') || 'How to Earn More AgriCreds'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <span className="text-success font-bold">+10</span>
              </div>
              <span className="text-sm">{t('agriCredits.earnPost') || 'Share a post in community'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <span className="text-success font-bold">+15</span>
              </div>
              <span className="text-sm">{t('agriCredits.earnAnswer') || 'Provide helpful answers'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <span className="text-success font-bold">+5</span>
              </div>
              <span className="text-sm">{t('agriCredits.earnQuestion') || 'Ask questions in chat'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <span className="text-success font-bold">+20</span>
              </div>
              <span className="text-sm">{t('agriCredits.earnLike') || 'Get likes on your posts'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AgriCredits; 