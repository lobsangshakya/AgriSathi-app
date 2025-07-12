import { useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Scan, AlertTriangle, CheckCircle } from "lucide-react";

const DiseaseDetection = () => {
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
      <Header title="फसल स्कैन करें" />
      
      <div className="p-4 space-y-4">
        {/* Upload Section */}
        <Card className="p-6 text-center">
          <div className="mb-4">
            <Camera className="h-16 w-16 mx-auto text-primary mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              फसल की फोटो अपलोड करें
            </h2>
            <p className="text-sm text-muted-foreground">
              पत्तियों, फूलों या फलों की स्पष्ट तस्वीर लें
            </p>
          </div>
          
          <div className="space-y-3">
            <label htmlFor="image-upload">
              <Button className="w-full" variant="gradient">
                <Upload className="h-4 w-4 mr-2" />
                गैलरी से चुनें
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
              कैमरा खोलें
            </Button>
          </div>
        </Card>

        {/* Image Preview */}
        {selectedImage && (
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-3">अपलोड की गई फोटो</h3>
            <img 
              src={selectedImage} 
              alt="Uploaded crop" 
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            
            {!analysisResult && !isAnalyzing && (
              <Button onClick={analyzeImage} className="w-full" variant="success">
                <Scan className="h-4 w-4 mr-2" />
                AI विश्लेषण शुरू करें
              </Button>
            )}
          </Card>
        )}

        {/* Analysis Loading */}
        {isAnalyzing && (
          <Card className="p-6 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-foreground font-medium">AI विश्लेषण चल रहा है...</p>
            <p className="text-sm text-muted-foreground">कृपया प्रतीक्षा करें</p>
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
                    आत्मविश्वास: {analysisResult.confidence}% | गंभीरता: {analysisResult.severity}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                तुरंत करने योग्य उपाय
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
              <h4 className="font-semibold text-foreground mb-3">भविष्य में बचाव</h4>
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
                विशेषज्ञ से संपर्क करें
              </Button>
              <Button className="flex-1" variant="gradient">
                दवाई खरीदें
              </Button>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <Card className="p-4 bg-accent/10">
          <h4 className="font-semibold text-foreground mb-2">बेहतर परिणाम के लिए टिप्स</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• प्राकृतिक रोशनी में फोटो लें</li>
            <li>• पत्ती को पास से फोकस करें</li>
            <li>• साफ़ और स्पष्ट तस्वीर लें</li>
            <li>• एक से अधिक कोण से फोटो लें</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default DiseaseDetection;