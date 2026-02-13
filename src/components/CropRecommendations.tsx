import { Sprout, Calendar, TrendingUp, AlertTriangle, Leaf, Clock, DollarSign, Target } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const CropRecommendations = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const recommendations = [
    {
      cropKey: "crops.tomato",
      seasonKey: "crops.season.rabi",
      profitabilityKey: "crops.profitability.high",
      expectedYield: "25-30",
      yieldUnitKey: "crops.yield.ton_per_hectare",
      marketPrice: "₹15-20",
      marketUnitKey: "crops.market_unit.kg",
      sowingTimeKey: "crops.sowing.oct_nov",
      icon: "",
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-500/10",
      iconColor: "text-red-600",
      growthStage: language === 'hindi' ? 'विकास चरण' : 'Growth Stage',
      stage: language === 'hindi' ? 'फूल आना' : 'Flowering',
      daysLeft: 45
    },
    {
      cropKey: "crops.wheat",
      seasonKey: "crops.season.rabi",
      profitabilityKey: "crops.profitability.medium",
      expectedYield: "40-45",
      yieldUnitKey: "crops.yield.qtl_per_hectare",
      marketPrice: "₹2200-2500",
      marketUnitKey: "crops.market_unit.qtl",
      sowingTimeKey: "crops.sowing.nov_dec",
      icon: "",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-600",
      growthStage: language === 'hindi' ? 'विकास चरण' : 'Growth Stage',
      stage: language === 'hindi' ? 'बीज बनना' : 'Seed Formation',
      daysLeft: 30
    }
  ];

  const alerts = [
    {
      key: "alerts.tomato_pest",
      type: "warning",
      icon: "",
      color: "from-orange-50 to-red-50",
      borderColor: "border-orange-200"
    },
    {
      key: "alerts.irrigation_needed",
      type: "info",
      icon: "",
      color: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200"
    }
  ];

  const handleViewDetails = (cropKey: string) => {
    const cropName = t(cropKey);
    toast({
      title: `${cropName} ${t('crops.details')}`,
      description: t('crops.detailedInfo') || 'Detailed crop information and recommendations',
    });
  };

  const getProfitabilityColor = (profitability: string) => {
    if (profitability.includes('high')) return 'bg-green-100 text-green-800 border-green-200';
    if (profitability.includes('medium')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-2">
          <Sprout className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gradient">
            {t('crops.recommendations') || 'Crop Recommendations'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('crops.subtitle') || 'Best crops for current season'}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <Card 
              key={index} 
              className={`p-4 border-l-4 border-l-orange-500 animate-slide-up ${alert.color} ${alert.borderColor}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{alert.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800">
                    {t(alert.key)}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    {t('alerts.actionRequired') || 'Action required'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  {t('alerts.view') || 'View'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Crop Recommendations */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <Card 
            key={index} 
            className="card-enhanced group hover-scale transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`${rec.bgColor} rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{rec.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {t(rec.cropKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(rec.seasonKey)} {t('crops.season')}
                    </p>
                  </div>
                </div>
                <Badge 
                  className={`px-3 py-1 border ${getProfitabilityColor(rec.profitabilityKey)}`}
                >
                  {t(rec.profitabilityKey)} {t('crops.profitability')}
                </Badge>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-background/50 rounded-lg p-3 text-center hover-lift">
                  <TrendingUp className="h-5 w-5 mx-auto mb-2 text-success" />
                  <p className="text-xs text-muted-foreground mb-1">{t('crops.yield')}</p>
                  <p className="text-sm font-bold text-foreground">
                    {rec.expectedYield} {t(rec.yieldUnitKey)}
                  </p>
                </div>
                <div className="bg-background/50 rounded-lg p-3 text-center hover-lift">
                  <DollarSign className="h-5 w-5 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground mb-1">{t('crops.marketPrice')}</p>
                  <p className="text-sm font-bold text-foreground">
                    {rec.marketPrice} {t(rec.marketUnitKey)}
                  </p>
                </div>
              </div>

              {/* Growth Stage */}
              <div className="bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {rec.growthStage}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {rec.stage}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {t('crops.daysLeft') || 'Days left'}: {rec.daysLeft}
                  </span>
                </div>
              </div>

              {/* Sowing Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="text-sm text-muted-foreground">
                    {t('crops.sowing')}:
                  </span>
                  <span className="text-sm font-medium">
                    {t(rec.sowingTimeKey)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(rec.cropKey)}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                >
                  {t('crops.viewDetails') || 'View Details'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-card p-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="text-center">
          <Target className="h-8 w-8 mx-auto mb-3 text-primary" />
          <h4 className="font-medium text-foreground mb-2">
            {t('crops.needHelp') || 'Need help with crop selection?'}
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            {t('crops.consultExpert') || 'Get personalized advice from agricultural experts'}
          </p>
          <Button 
            className="btn-primary-enhanced"
            onClick={() => navigate('/expert-consultation')}
          >
            {t('crops.consultNow') || 'Consult Expert'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
