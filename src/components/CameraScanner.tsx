import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Camera, RotateCcw, CameraOff, Settings, Flashlight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CameraScannerProps {
  onImageCapture: (imageData: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const CameraScanner = ({ onImageCapture, onClose, isOpen }: CameraScannerProps) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      
      // Stop existing stream
      if (streamRef.current) {
        stopCamera();
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsStreaming(true);
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError(t('camera.accessError') || 'Camera access denied');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      // Call the callback with captured image
      onImageCapture(imageData);
    }

    setIsCapturing(false);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const toggleFlash = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack && videoTrack.getCapabilities) {
        const capabilities = videoTrack.getCapabilities();
        // Check if torch capability exists (TypeScript safe)
        if ('torch' in capabilities && capabilities.torch) {
          const newTorchState = !isFlashOn;
          videoTrack.applyConstraints({
            advanced: [{ torch: newTorchState } as any]
          }).then(() => {
            setIsFlashOn(newTorchState);
          }).catch(err => {
            console.error('Flash toggle failed:', err);
          });
        }
      }
    }
  };

  const retakePhoto = () => {
    // Reset the camera view
    if (videoRef.current) {
      videoRef.current.style.display = 'block';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md mx-auto">
        {/* Camera View */}
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Camera Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Scanning Frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
                {/* Corner Indicators */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-primary"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-primary"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-primary"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-primary"></div>
                
                {/* Scanning Animation */}
                <div className="absolute inset-0 border-2 border-primary/30 animate-pulse"></div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="absolute bottom-32 left-0 right-0 text-center text-white">
              <p className="text-sm opacity-80">
                {t('camera.alignPlant') || 'Align the plant within the frame'}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <Card className="p-6 text-center max-w-sm mx-4">
                <CameraOff className="h-12 w-12 mx-auto text-destructive mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  {t('camera.error') || 'Camera Error'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={startCamera} className="w-full">
                  {t('camera.retry') || 'Retry'}
                </Button>
              </Card>
            </div>
          )}
        </div>

        {/* Hidden Canvas for Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              
            </Button>

            {/* Capture Button */}
            <Button
              onClick={captureImage}
              disabled={!isStreaming || isCapturing}
              className="w-16 h-16 rounded-full bg-white/20 border-4 border-white/50 hover:bg-white/30 disabled:opacity-50"
            >
              {isCapturing ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-8 h-8 bg-white rounded-full"></div>
              )}
            </Button>

            {/* Camera Controls */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={switchCamera}
                className="text-white hover:bg-white/20"
                disabled={!isStreaming}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFlash}
                className={`text-white hover:bg-white/20 ${isFlashOn ? 'bg-white/20' : ''}`}
                disabled={!isStreaming}
              >
                <Flashlight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {!isStreaming && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm">{t('camera.initializing') || 'Initializing camera...'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 