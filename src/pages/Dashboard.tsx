import { Header } from "@/components/Header";
import { QuickActions } from "@/components/QuickActions";
import { WeatherCard } from "@/components/WeatherCard";
import { CropRecommendations } from "@/components/CropRecommendations";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-farming.jpg";
import { Sparkles, TrendingUp, Users, Leaf } from "lucide-react";

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header title={t('header.agrisathi')} />
      
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden mb-6">
        <div className="relative">
          <img 
            src={heroImage} 
            alt="Modern farming in India" 
            className="w-full h-48 object-cover rounded-b-3xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-hero rounded-b-3xl" />
          
          {/* Floating Elements */}
          <div className="absolute top-4 right-4 animate-float">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 animate-float" style={{ animationDelay: '1s' }}>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Leaf className="h-6 w-6 text-white" />
            </div>
          </div>
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h2 className="text-3xl font-bold mb-3 animate-fade-in-up">
                {t('dashboard.welcome')}
              </h2>
              <p className="text-lg opacity-90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {t('dashboard.subtitle')}
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3 mt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm font-semibold">+15%</div>
                  <div className="text-xs opacity-80">Yield</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <Users className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm font-semibold">2.5K</div>
                  <div className="text-xs opacity-80">Farmers</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <Leaf className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm font-semibold">50+</div>
                  <div className="text-xs opacity-80">Crops</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Content Section */}
      <div className="space-y-enhanced px-4">
        <div className="animate-slide-up">
          <QuickActions />
        </div>
        
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <WeatherCard />
        </div>
        
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CropRecommendations />
        </div>
        
        {/* New Feature Highlight */}
        <div className="bg-gradient-card rounded-2xl-enhanced p-6 shadow-card hover:shadow-hover transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 rounded-full p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gradient">
              {t('dashboard.newFeatures') || 'New Features'}
            </h3>
          </div>
          <p className="text-muted-foreground mb-4">
            {t('dashboard.newFeaturesDesc') || 'Discover the latest tools and features to enhance your farming experience'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background/50 rounded-xl p-3 text-center hover-lift">
              <div className="text-2xl mb-2"></div>
              <div className="text-sm font-medium">AI Crop Analysis</div>
            </div>
            <div className="bg-background/50 rounded-xl p-3 text-center hover-lift">
              <div className="text-2xl mb-2"></div>
              <div className="text-sm font-medium">Expert Chat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;