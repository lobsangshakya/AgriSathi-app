import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Scan, AlertTriangle, CheckCircle, RefreshCw, Info, FileImage } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CameraScanner } from "@/components/CameraScanner";
import { aiService, compressImage, DiseaseAnalysisResult } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const DiseaseDetection = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysisResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedCropType, setSelectedCropType] = useState<string>('');
  const [analysisHistory, setAnalysisHistory] = useState<DiseaseAnalysisResult[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file); // Debug log
    
    if (file) {
      await processImageFile(file);
    } else {
      console.log('No file selected'); // Debug log
    }
  };

  const processImageFile = async (file: File) => {
    try {
      console.log('Processing file:', file.name, file.size, file.type); // Debug log
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: t('common.error') || 'Error',
          description: t('disease.invalidFileType') || 'Please select a valid image file',
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t('common.error') || 'Error',
          description: t('disease.fileTooLarge') || 'File size should be less than 10MB',
          variant: 'destructive',
        });
        return;
      }
      
      const compressedImage = await compressImage(file);
      console.log('Image compressed successfully'); // Debug log
      setSelectedImage(compressedImage);
      setAnalysisResult(null);
      
      toast({
        title: t('disease.imageUploaded') || 'Image Uploaded',
        description: t('disease.imageReadyForAnalysis') || 'Image is ready for analysis',
      });
    } catch (error) {
      console.error('Image processing error:', error); // Debug log
      toast({
        title: t('common.error') || 'Error',
        description: t('disease.uploadError') || 'Failed to process image',
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      await processImageFile(file);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleCameraCapture = (imageData: string) => {
    setSelectedImage(imageData);
    setAnalysisResult(null);
    setIsCameraOpen(false);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      let result: DiseaseAnalysisResult;
      
      try {
        result = await aiService.advancedDiseaseDetection(selectedImage);
      } catch (error) {
        result = await apiService.analyzeDisease(selectedImage, selectedCropType);
      }

      setAnalysisResult(result);
      setAnalysisHistory(prev => [result, ...prev.slice(0, 4)]);
      
      toast({
        title: t('disease.analysisComplete') || 'Analysis Complete',
        description: `${result.disease} detected with ${result.confidence}% confidence`,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: t('common.error') || 'Error',
        description: t('disease.analysisError') || 'Failed to analyze image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-app">
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
          
          {/* Crop Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('disease.selectCrop') || 'Select Crop Type (Optional)'}
            </label>
            <select
              value={selectedCropType}
              onChange={(e) => setSelectedCropType(e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="">{t('disease.autoDetect') || 'Auto Detect'}</option>
              <option value="tomato">टमाटर (Tomato)</option>
              <option value="potato">आलू (Potato)</option>
              <option value="wheat">गेहूं (Wheat)</option>
              <option value="rice">चावल (Rice)</option>
              <option value="corn">मक्का (Corn)</option>
              <option value="cotton">कपास (Cotton)</option>
              <option value="sugarcane">गन्ना (Sugarcane)</option>
            </select>
          </div>
          
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 mb-4 transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-2">
              {t('disease.dragDropText') || 'Drag and drop an image here, or click to browse'}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleFileSelect}
            >
              <Upload className="h-4 w-4 mr-2" />
              {t('disease.browseFiles') || 'Browse Files'}
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <label htmlFor="image-upload" className="cursor-pointer">
                <Button className="w-full" variant="gradient">
                  <Upload className="h-4 w-4 mr-2" />
                  {t('disease.gallery')}
                </Button>
              </label>
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                capture={false}
              />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {t('disease.supportedFormats') || 'Supported: JPG, PNG, WebP (Max 10MB)'}
              </p>
            </div>
            
            <div className="relative">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setIsCameraOpen(true)}
              >
                <Camera className="h-4 w-4 mr-2" />
                {t('disease.camera')}
              </Button>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {t('disease.cameraDescription') || 'Take a photo directly'}
              </p>
            </div>
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

        {/* Analysis History */}
        {analysisHistory.length > 0 && (
          <Card className="p-4">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              {t('disease.recentAnalyses') || 'Recent Analyses'}
            </h4>
            <div className="space-y-2">
              {analysisHistory.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-accent/10 rounded">
                  <div>
                    <p className="text-sm font-medium">{result.disease}</p>
                    <p className="text-xs text-muted-foreground">
                      {result.confidence}% confidence • {result.severity} severity
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAnalysisResult(result)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>
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

      {/* Camera Scanner */}
      <CameraScanner
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onImageCapture={handleCameraCapture}
      />
    </div>
  );
};

export default DiseaseDetection;