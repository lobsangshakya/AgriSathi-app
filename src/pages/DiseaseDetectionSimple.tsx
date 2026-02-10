/**
 * Simplified Disease Detection Scanner
 * Clean, easy-to-use interface for farmers
 */

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  Scan, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  FileImage,
  ArrowRight
} from "lucide-react";
import { CameraScanner } from "@/components/CameraScanner";
import { compressImage, DiseaseAnalysisResult } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/utils/utils";

const DiseaseDetectionSimple = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysisResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      await processImageFile(file);
    }
  };

  const processImageFile = async (file: File) => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: language === 'hindi' ? 'गलती' : 'Error',
          description: language === 'hindi' 
            ? 'कृपया एक वैध छवि फ़ाइल चुनें' 
            : 'Please select a valid image file',
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: language === 'hindi' ? 'गलती' : 'Error',
          description: language === 'hindi' 
            ? 'फ़ाइल का आकार 10MB से कम होना चाहिए' 
            : 'File size should be less than 10MB',
          variant: 'destructive',
        });
        return;
      }

      // Compress and process image
      const compressedImage = await compressImage(file);
      setSelectedImage(compressedImage);
      
      toast({
        title: language === 'hindi' ? 'सफलता' : 'Success',
        description: language === 'hindi' 
          ? 'छवि अपलोड हो गई। अब विश्लेषण करें।' 
          : 'Image uploaded. Now start analysis.',
      });
    } catch (error) {
      toast({
        title: language === 'hindi' ? 'गलती' : 'Error',
        description: language === 'hindi' 
          ? 'छवि प्रोसेस करने में समस्या' 
          : 'Error processing image',
        variant: 'destructive',
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) {
      toast({
        title: language === 'hindi' ? 'गलती' : 'Error',
        description: language === 'hindi' 
          ? 'कृपया पहले एक छवि अपलोड करें' 
          : 'Please upload an image first',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis result
      const mockResult: DiseaseAnalysisResult = {
        disease: language === 'hindi' ? 'टमाटर का पीला मोज़ेक वाइरस' : 'Tomato Yellow Mosaic Virus',
        confidence: 85,
        severity: 'medium',
        recommendations: language === 'hindi' ? [
          'प्रभावित पौधे हटा दें और नष्ट कर दें',
          'फसल चक्र का पालन करें',
          'प्रतिरोधी किस्में का उपयोग करें'
        ] : [
          'Remove and destroy affected plants',
          'Follow crop rotation',
          'Use resistant varieties'
        ],
        preventiveMeasures: language === 'hindi' ? [
          'बीज उपचार करें',
          'कीट नियंत्रण करें',
          'साफ-सफाई बनाए रखें'
        ] : [
          'Treat seeds',
          'Control pests',
          'Maintain cleanliness'
        ],
        treatment: language === 'hindi' ? [
          'नीम तेल स्प्रे करें',
          'जैविक कीटनाशक का उपयोग करें',
          'पोषक तत्वों का प्रबंधन करें'
        ] : [
          'Spray neem oil',
          'Use organic pesticides',
          'Manage nutrients'
        ],
        symptoms: language === 'hindi' ? [
          'पत्तियों पर पीले धब्बे',
          'पौधे का विकास धीमा',
          'फल छोटे व विकृत'
        ] : [
          'Yellow spots on leaves',
          'Stunted plant growth',
          'Small and deformed fruits'
        ]
      };

      setAnalysisResult(mockResult);
      
      toast({
        title: language === 'hindi' ? 'विश्लेषण पूर्ण' : 'Analysis Complete',
        description: language === 'hindi' 
          ? 'बीमारी की पहचान हो गई है। नीचे देखें।' 
          : 'Disease identified. See results below.',
      });
    } catch (error) {
      toast({
        title: language === 'hindi' ? 'गलती' : 'Error',
        description: language === 'hindi' 
          ? 'विश्लेषण में समस्या' 
          : 'Analysis failed',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'hindi' ? 'फसल जांच' : 'Crop Scanner'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'hindi' ? 'बीमारी की पहचान करें' : 'Detect crop diseases'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
            >
              {language === 'hindi' ? 'वापस' : 'Back'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {!selectedImage && !analysisResult && (
          <div>
            {/* Instructions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'hindi' ? 'फसल की फोटो अपलोड करें' : 'Upload Crop Photo'}
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Camera className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {language === 'hindi' ? 'अच्छी तस्वीरें के लिए:' : 'For best results:'}
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• {language === 'hindi' ? 'पत्तियों की स्पष्ट फोटो लें' : 'Take clear photos of leaves'}</li>
                      <li>• {language === 'hindi' ? 'धुप में फोटो खींचें' : 'Take photos in daylight'}</li>
                      <li>• {language === 'hindi' ? 'बीमारी के लक्षण दिखें' : 'Show disease symptoms'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <Card
              className={cn(
                "border-2 border-dashed transition-colors cursor-pointer",
                isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="p-8 text-center">
                <div className="mb-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'hindi' ? 'फोटो अपलोड करें' : 'Upload Photo'}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {language === 'hindi' 
                    ? 'फ़ाइल खींचें या यहां डालें' 
                    : 'Drag and drop or click to upload'}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm">
                    <FileImage className="w-4 h-4 mr-2" />
                    {language === 'hindi' ? 'गैलरी' : 'Gallery'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCameraOpen(true);
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {language === 'hindi' ? 'कैमरा' : 'Camera'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  {language === 'hindi' 
                    ? 'समर्थित: JPG, PNG (अधिकतम 10MB)' 
                    : 'Supported: JPG, PNG (max 10MB)'}
                </p>
              </div>
            </Card>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Image Preview */}
        {selectedImage && !analysisResult && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {language === 'hindi' ? 'अपलोड की गई फोटो' : 'Uploaded Photo'}
            </h3>
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Crop analysis" 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-4">
                <Button 
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {language === 'hindi' ? 'विश्लेषण जारी...' : 'Analyzing...'}
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      {language === 'hindi' ? 'विश्लेषण शुरू करें' : 'Start Analysis'}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Analysis Result */}
        {analysisResult && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {language === 'hindi' ? 'विश्लेषण परिणाम' : 'Analysis Results'}
            </h3>
            <Card className="overflow-hidden">
              <div className="p-4">
                {/* Disease Name and Confidence */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-900">{analysisResult.disease}</h4>
                    <Badge className={getSeverityColor(analysisResult.severity)}>
                      {getSeverityIcon(analysisResult.severity)}
                      <span className="ml-1">
                        {language === 'hindi' ? analysisResult.severity : analysisResult.severity}
                      </span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${analysisResult.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {analysisResult.confidence}% {language === 'hindi' ? 'विश्वास' : 'confidence'}
                    </span>
                  </div>
                </div>

                {/* Treatment */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {language === 'hindi' ? 'उपचार' : 'Treatment'}
                  </h5>
                  <ul className="space-y-1">
                    {analysisResult.treatment.map((treatment, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        {treatment}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/chat')}
                    className="flex-1"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {language === 'hindi' ? 'विशेषज्ञ से बात करें' : 'Talk to Expert'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedImage(null);
                      setAnalysisResult(null);
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Camera Scanner Modal */}
        {isCameraOpen && (
          <CameraScanner
            isOpen={isCameraOpen}
            onImageCapture={(imageData: string) => {
              setSelectedImage(imageData);
              setIsCameraOpen(false);
            }}
            onClose={() => setIsCameraOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DiseaseDetectionSimple;
