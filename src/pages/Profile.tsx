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
  Globe,
  TrendingUp
} from "lucide-react";

const Profile = () => {
  const userProfile = {
    name: "राजेश कुमार",
    phone: "+91 98765 43210",
    location: "गाँव: रामपुर, जिला: मेरठ, उत्तर प्रदेश",
    landSize: "2.5 एकड़",
    experience: "15 साल",
    agriCreds: 1250,
    joinDate: "जनवरी 2024",
    language: "हिंदी",
    crops: ["गेहूं", "धान", "गन्ना", "सरसों"],
    achievements: [
      { title: "सामुदायिक योगदानकर्ता", points: 500, icon: "🏆" },
      { title: "जैविक खेती विशेषज्ञ", points: 300, icon: "🌱" },
      { title: "मौसम पूर्वानुमान गुरु", points: 200, icon: "🌦️" }
    ],
    stats: {
      postsShared: 15,
      helpfulAnswers: 8,
      questionsAsked: 12,
      creditsEarned: 1250
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header title="मेरी प्रोफाइल" />
      
      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <Card className="p-6 text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {userProfile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-foreground mb-2">{userProfile.name}</h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Phone className="h-4 w-4" />
            <span className="text-sm">{userProfile.phone}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{userProfile.location}</span>
          </div>
          
          {/* AgriCreds Display */}
          <Card className="p-4 bg-gradient-primary text-primary-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="h-6 w-6" />
              <span className="text-2xl font-bold">₹{userProfile.agriCreds}</span>
            </div>
            <p className="text-sm opacity-90">कुल AgriCreds</p>
          </Card>
        </Card>

        {/* Farming Info */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            खेती की जानकारी
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">भूमि का आकार</p>
              <p className="font-medium">{userProfile.landSize}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">अनुभव</p>
              <p className="font-medium">{userProfile.experience}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">सदस्य बने</p>
              <p className="font-medium">{userProfile.joinDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">भाषा</p>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <p className="font-medium">{userProfile.language}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">मुख्य फसलें</p>
            <div className="flex flex-wrap gap-2">
              {userProfile.crops.map(crop => (
                <Badge key={crop} variant="secondary">{crop}</Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            गतिविधि सांख्यिकी
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{userProfile.stats.postsShared}</p>
              <p className="text-sm text-muted-foreground">पोस्ट साझा की</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{userProfile.stats.helpfulAnswers}</p>
              <p className="text-sm text-muted-foreground">सहायक उत्तर</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{userProfile.stats.questionsAsked}</p>
              <p className="text-sm text-muted-foreground">प्रश्न पूछे</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{userProfile.stats.creditsEarned}</p>
              <p className="text-sm text-muted-foreground">Credits कमाए</p>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-warning" />
            उपलब्धियां
          </h3>
          <div className="space-y-3">
            {userProfile.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{achievement.title}</p>
                  <p className="text-sm text-success">+{achievement.points} AgriCreds</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button className="w-full" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            सेटिंग्स
          </Button>
          <Button className="w-full" variant="outline">
            <Globe className="h-4 w-4 mr-2" />
            भाषा बदलें
          </Button>
          <Button className="w-full bg-primary hover:bg-primary/90">
            <Award className="h-4 w-4 mr-2" />
            AgriCreds रिडीम करें
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;