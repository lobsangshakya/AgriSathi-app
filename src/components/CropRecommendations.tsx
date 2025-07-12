import { Sprout, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const CropRecommendations = () => {
  const { t } = useLanguage();

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
      icon: "🍅"
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
      icon: "🌾"
    }
  ];

  const alerts = [
    "alerts.tomato_pest",
    "alerts.irrigation_needed"
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">{t('crops.recommendations')}</h2>
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-4">
          {alerts.map((alertKey, index) => (
            <Card key={index} className="p-3 mb-2 bg-warning/10 border-warning/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-sm text-warning-foreground">{t(alertKey)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
      {/* Crop Recommendations */}
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <Card key={index} className="p-4 border-border/50 hover:shadow-soft transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{rec.icon}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{t(rec.cropKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(rec.seasonKey)} {t('crops.season')}</p>
                </div>
              </div>
              <Badge 
                variant={rec.profitabilityKey === "crops.profitability.high" ? "default" : "secondary"}
                className={rec.profitabilityKey === "crops.profitability.high" ? "bg-success text-success-foreground" : ""}
              >
                {t(rec.profitabilityKey)} {t('crops.profitability')}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">{t('crops.yield')}:</span>
                <span className="font-medium">{rec.expectedYield} {t(rec.yieldUnitKey)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">{t('crops.sowing')}:</span>
                <span className="font-medium">{t(rec.sowingTimeKey)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-success">
                {t('crops.marketRate')}: {rec.marketPrice}/{t(rec.marketUnitKey)}
              </span>
              <Button size="sm" variant="outline" className="text-xs">
                {t('crops.viewDetails')}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};