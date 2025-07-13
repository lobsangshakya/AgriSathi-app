import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  MapPin, 
  Coins, 
  Calendar,
  Sprout,
  Award,
  Settings,
  Phone,
  Mail,
  Globe,
  TrendingUp,
  LogOut,
  Users
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { t, language } = useLanguage();
  const { user, logout, addAgriCreds } = useUser();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-earth flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Please log in to view your profile</h2>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const handleRedeemCredits = () => {
    // Navigate to AgriCreds redemption page
    navigate('/agri-credits');
  };

  const handleViewCredits = () => {
    // Navigate to AgriCredits page
    navigate('/agri-credits');
  };

  const handleSettings = () => {
    toast({
      title: language === 'hindi' ? 'सेटिंग्स' : 'Settings',
      description: language === 'hindi' 
        ? 'सेटिंग्स पेज जल्द ही उपलब्ध होगा'
        : 'Settings page coming soon',
    });
    // In a real app, navigate to settings page
    // navigate('/settings');
  };

  const handleChangeLanguage = () => {
    // This will be handled by the language toggle in header
    toast({
      title: language === 'hindi' ? 'भाषा बदलें' : 'Change Language',
      description: language === 'hindi' 
        ? 'हेडर में भाषा बटन का उपयोग करें'
        : 'Use the language button in the header',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header title={t('profile.title')} />
      
      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <Card className="p-6 text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-foreground mb-2">{user.name}</h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Mail className="h-4 w-4" />
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Phone className="h-4 w-4" />
            <span className="text-sm">{user.phone}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{user.location}</span>
          </div>
          
          {/* AgriCreds Display */}
          <Card className="p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white cursor-pointer hover:shadow-lg transition-all" onClick={handleViewCredits}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="h-6 w-6" />
              <span className="text-2xl font-bold">{user.agriCreds}</span>
            </div>
            <p className="text-sm opacity-90">
              {language === 'hindi' ? 'कुल AgriCreds - देखने के लिए क्लिक करें' : 'Total AgriCreds - Click to view'}
            </p>
          </Card>
        </Card>

        {/* Farming Info */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            {t('profile.farmingInfo')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('profile.landSize')}</p>
              <p className="font-medium">{user.landSize}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('profile.experience')}</p>
              <p className="font-medium">{user.experience}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('profile.memberSince')}</p>
              <p className="font-medium">{user.joinDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('profile.language')}</p>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <p className="font-medium">{user.language}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">{t('profile.mainCrops')}</p>
            <div className="flex flex-wrap gap-2">
              {user.crops.map(crop => (
                <Badge key={crop} variant="secondary">{crop}</Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            {t('profile.activityStats')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{user.stats.postsShared}</p>
              <p className="text-sm text-muted-foreground">{t('profile.postsShared')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{user.stats.helpfulAnswers}</p>
              <p className="text-sm text-muted-foreground">{t('profile.helpfulAnswers')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{user.stats.questionsAsked}</p>
              <p className="text-sm text-muted-foreground">{t('profile.questionsAsked')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{user.stats.creditsEarned}</p>
              <p className="text-sm text-muted-foreground">{t('profile.creditsEarned')}</p>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-warning" />
            {t('profile.achievements')}
          </h3>
          <div className="space-y-3">
            {user.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{achievement.title}</p>
                  <p className="text-sm text-success">+{achievement.points} AgriCreds</p>
                </div>
              </div>
            ))}
            {user.achievements.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p>{t('profile.noAchievements') || 'No achievements yet'}</p>
                <p className="text-sm">{t('profile.keepParticipating') || 'Keep participating to earn achievements!'}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button className="w-full" variant="outline" onClick={handleSettings}>
            <Settings className="h-4 w-4 mr-2" />
            {t('profile.settings')}
          </Button>
          <Button className="w-full" variant="outline" onClick={handleChangeLanguage}>
            <Globe className="h-4 w-4 mr-2" />
            {t('profile.changeLanguage')}
          </Button>
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleRedeemCredits}
            disabled={user.agriCreds < 50}
          >
            <Users className="h-4 w-4 mr-2" />
            {t('profile.redeemCredits')} (50 {t('profile.credits') || 'Credits'})
          </Button>
          <Button 
            className="w-full bg-destructive hover:bg-destructive/90 text-white" 
            onClick={() => {
              logout();
              navigate('/auth');
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('profile.logout') || 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;