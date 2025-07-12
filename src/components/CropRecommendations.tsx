import { Sprout, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export const CropRecommendations = () => {
  const recommendations = [
    {
      crop: "टमाटर",
      season: "रबी",
      profitability: "उच्च",
      riskLevel: "मध्यम",
      expectedYield: "25-30 टन/हेक्टेयर",
      marketPrice: "₹15-20/किग्रा",
      sowingTime: "अक्टूबर-नवंबर",
      icon: "🍅"
    },
    {
      crop: "गेहूं",
      season: "रबी", 
      profitability: "मध्यम",
      riskLevel: "कम",
      expectedYield: "40-45 क्विंटल/हेक्टेयर",
      marketPrice: "₹2200-2500/क्विंटल",
      sowingTime: "नवंबर-दिसंबर",
      icon: "🌾"
    }
  ];

  const alerts = [
    "🐛 टमाटर में कीट प्रकोप की चेतावनी - तुरंत उपचार करें",
    "💧 सिंचाई की जरूरत - मिट्टी की नमी कम है"
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">फसल सुझाव</h2>
      
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-4">
          {alerts.map((alert, index) => (
            <Card key={index} className="p-3 mb-2 bg-warning/10 border-warning/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-sm text-warning-foreground">{alert}</p>
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
                  <h3 className="font-semibold text-foreground">{rec.crop}</h3>
                  <p className="text-sm text-muted-foreground">{rec.season} सीजन</p>
                </div>
              </div>
              <Badge 
                variant={rec.profitability === "उच्च" ? "default" : "secondary"}
                className={rec.profitability === "उच्च" ? "bg-success text-success-foreground" : ""}
              >
                {rec.profitability} लाभ
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">उत्पादन:</span>
                <span className="font-medium">{rec.expectedYield}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">बुआई:</span>
                <span className="font-medium">{rec.sowingTime}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-success">
                बाजार दर: {rec.marketPrice}
              </span>
              <Button size="sm" variant="outline" className="text-xs">
                विस्तार देखें
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};