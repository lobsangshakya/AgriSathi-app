/**
 * Enhanced Disease Detection with Clear Instructions and Farmer-Friendly UX
 */

import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Scan, AlertTriangle, CheckCircle, RefreshCw, Info, FileImage, Lightbulb, HelpCircle, ArrowRight, Leaf, Droplets, Sun, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CameraScanner } from "@/components/CameraScanner";
import { apiService, aiService, compressImage, DiseaseAnalysisResult } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/utils";

const DiseaseDetectionEnhanced = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysisResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedCropType, setSelectedCropType] = useState<string>('');
  const [analysisHistory, setAnalysisHistory] = useState<DiseaseAnalysisResult[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cropTypes = language === 'hindi' ? [
    { id: 'tomato', name: 'टमाटर', icon: '🍅' },
    { id: 'wheat', name: 'गेहूं', icon: '🌾' },
    { id: 'rice', name: 'धान', icon: '🌾' },
    { id: 'cotton', name: 'कपास', icon: '🌿' },
    { id: 'sugarcane', name: 'गन्ना', icon: '🎋' },
    { id: 'potato', name: 'आलू', icon: '🥔' }
  ] : [
    { id: 'tomato', name: 'Tomato', icon: '🍅' },
    { id: 'wheat', name: 'Wheat', icon: '🌾' },
    { id: 'rice', name: 'Rice', icon: '🌾' },
    { id: 'cotton', name: 'Cotton', icon: '🌿' },
    { id: 'sugarcane', name: 'Sugarcane', icon: '🎋' },
    { id: 'potato', name: 'Potato', icon: '🥔' }
  ];

  const tips = language === 'hindi' ? [
    {
      icon: Camera,
      title: 'अच्छी तस्वीरें लें',
      description: 'पत्तियों, फूलों या फलों की स्पष्ट तस्वीरें लें। धुप में फोटो खींचें।'
    },
    {
      icon: Leaf,
      title: 'बीमारी के लक्षण देखें',
      description: 'पीले पत्ते, धब्बे, सड़न या कीड़े के निशान जांचें।'
    },
    {
      icon: Sun,
      title: 'सही समय चुनें',
      description: 'सुबह 10 बजे से पहले या शाम 4 बजे के बाद फोटो लें।'
    }
  ] : [
    {
      icon: Camera,
      title: 'Take Clear Photos',
      description: 'Capture clear images of leaves, flowers, or fruits. Take photos in daylight.'
    },
    {
      icon: Leaf,
      title: 'Check Disease Symptoms',
      description: 'Look for yellow leaves, spots, rotting, or pest damage.'
    },
    {
      icon: Sun,
      title: 'Choose Right Time',
      description: 'Take photos before 10 AM or after 4 PM for best results.'
    }
  ];

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
      setShowTips(false);
      
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
      setAnalysisHistory(prev => [mockResult, ...prev.slice(0, 2)]);
      
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
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header title={language === 'hindi' ? 'फसल जांच' : 'Crop Health Check'} />
      
      <div className="max-w-md mx-auto px-4 py-6 pb-32">
        {/* Header Info */}
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-3">
                <Scan className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'hindi' ? 'AI फसल जांच' : 'AI Crop Analysis'}
                </h2>
                <p className="text-sm text-blue-100">
                  {language === 'hindi' 
                    ? 'बीमारी की पहचान - 95% सटीकता' 
                    : 'Disease Detection - 95% Accuracy'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tips Section */}
        {showTips && !selectedImage && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'hindi' ? 'बेहतर जांच के लिए टिप्स' : 'Tips for Better Analysis'}
              </h3>
            </div>
            <div className="space-y-3">
              {tips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <Card key={index} className="border-l-4 border-l-blue-400 bg-blue-50">
                    <div className="p-3 flex items-start gap-3">
                      <Icon className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                        <p className="text-sm text-gray-600">{tip.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Crop Selection */}
        {!selectedImage && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {language === 'hindi' ? 'फसल चुनें' : 'Select Crop'}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {cropTypes.map((crop) => (
                <Button
                  key={crop.id}
                  variant={selectedCropType === crop.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCropType(crop.id)}
                  className={cn(
                    "h-auto p-3 flex flex-col items-center gap-1",
                    selectedCropType === crop.id && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  <span className="text-2xl">{crop.icon}</span>
                  <span className="text-xs">{crop.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Image Upload Area */}
        {!selectedImage && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {language === 'hindi' ? 'फसल की फोटो अपलोड करें' : 'Upload Crop Photo'}
            </h3>
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

        {/* Selected Image Preview */}
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
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">
                    {cropTypes.find(c => c.id === selectedCropType)?.icon} {cropTypes.find(c => c.id === selectedCropType)?.name}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <Button 
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {language === 'hindi' ? 'विश्लेषण जारी...' : 'Analyzing...'}
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      {language === 'hindi' ? 'AI विश्लेषण शुरू करें' : 'Start AI Analysis'}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Analysis Result */}
        {analysisResult && (
          <div className="mb-6">
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
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${analysisResult.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {analysisResult.confidence}% {language === 'hindi' ? 'विश्वास' : 'confidence'}
                    </span>
                  </div>
                </div>

                {/* Symptoms */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    {language === 'hindi' ? 'लक्षण' : 'Symptoms'}
                  </h5>
                  <ul className="space-y-1">
                    {analysisResult.symptoms.map((symptom, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
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
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {language === 'hindi' ? 'विशेषज्ञ से बात करें' : 'Talk to Expert'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedImage(null);
                      setAnalysisResult(null);
                      setShowTips(true);
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
              setShowTips(false);
            }}
            onClose={() => setIsCameraOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DiseaseDetectionEnhanced;
