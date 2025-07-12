import { useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Scan, AlertTriangle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DiseaseDetection = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        disease: "पत्ती का धब्बा रोग (Leaf Spot)",
        confidence: 92,
        severity: "मध्यम",
        recommendations: [
          "संक्रमित पत्तियों को तुरंत हटा दें",
          "कॉपर ऑक्सीक्लोराइड का छिड़काव करें",
          "नीम तेल का प्राकृतिक उपचार करें",
          "खेत में जल निकासी सुनिश्चित करें"
        ],
        preventiveMeasures: [
          "बीज उपचार करें",
          "उचित दूरी पर बुआई करें",
          "खेत की सफाई रखें"
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header title={t('disease.title')} />
      
      <div className="p-4 space-y-4">
        {/* Upload Section */}
        <Card className="p-6 text-center">
          <div className="mb-4">
            <Camera className="h-16 w-16 mx-auto text-primary mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t('disease.uploadPhoto')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('disease.uploadDescription')}
            </p>
          </div>
          
          <div className="space-y-3">
            <label htmlFor="image-upload">
              <Button className="w-full" variant="gradient">
                <Upload className="h-4 w-4 mr-2" />
                {t('disease.gallery')}
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            
            <Button className="w-full" variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              {t('disease.camera')}
            </Button>
          </div>
        </Card>

        {/* Image Preview */}
        {selectedImage && (
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-3">{t('disease.uploadedPhoto')}</h3>
            <img 
              src={selectedImage} 
              alt="Uploaded crop" 
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            
            {!analysisResult && !isAnalyzing && (
              <Button onClick={analyzeImage} className="w-full" variant="success">
                <Scan className="h-4 w-4 mr-2" />
                {t('disease.startAnalysis')}
              </Button>
            )}
          </Card>
        )}

        {/* Analysis Loading */}
        {isAnalyzing && (
          <Card className="p-6 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-foreground font-medium">{t('disease.analyzing')}</p>
            <p className="text-sm text-muted-foreground">{t('disease.pleaseWait')}</p>
          </Card>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-warning" />
                <div>
                  <h3 className="font-semibold text-foreground">{analysisResult.disease}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('disease.confidence')}: {analysisResult.confidence}% | {t('disease.severity')}: {analysisResult.severity}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                {t('disease.immediateActions')}
              </h4>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-foreground text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold text-foreground mb-3">{t('disease.futurePrevention')}</h4>
              <ul className="space-y-2">
                {analysisResult.preventiveMeasures.map((measure: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span className="text-foreground text-sm">{measure}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="flex gap-3">
              <Button className="flex-1" variant="outline">
                {t('disease.contactExpert')}
              </Button>
              <Button className="flex-1" variant="gradient">
                {t('disease.buyMedicine')}
              </Button>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <Card className="p-4 bg-accent/10">
          <h4 className="font-semibold text-foreground mb-2">{t('disease.tips')}</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {t('disease.tip1')}</li>
            <li>• {t('disease.tip2')}</li>
            <li>• {t('disease.tip3')}</li>
            <li>• {t('disease.tip4')}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default DiseaseDetection;