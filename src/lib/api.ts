// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.agrisathi.com';
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'https://ai.agrisathi.com';

// Types
export interface DiseaseAnalysisResult {
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  preventiveMeasures: string[];
  treatment: string[];
  scientificName?: string;
  symptoms: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice';
}

export interface ChatContext {
  language: string;
  lastMessage?: string;
  nlpResult?: any;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast: Array<{
    date: string;
    temp: number;
    description: string;
  }>;
}

export interface CropRecommendation {
  crop: string;
  confidence: number;
  reasons: string[];
  plantingTime: string;
  careInstructions: string[];
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: Date;
  category: string;
}

export interface CreatePostRequest {
  content: string;
  image?: string;
  category: string;
  language?: string;
}

export interface PostResponse {
  success: boolean;
  post?: CommunityPost;
  error?: string;
  message?: string;
}

// Image compression utility
export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const maxSize = 800;
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(compressedDataUrl);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Get location utility
export const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Import services
import { MockApiService, MockAiService } from './mockApi';
import { RealApiService, RealAiService } from './realApi';

// Check if we're in development mode or if real APIs are available
const USE_REAL_APIS = !import.meta.env.DEV && (
  import.meta.env.VITE_OPENWEATHER_API_KEY || 
  import.meta.env.VITE_PLANT_ID_API_KEY || 
  import.meta.env.VITE_AGRICULTURE_API_KEY
);

// Export service instances
export const apiService = USE_REAL_APIS ? new RealApiService() : new MockApiService();
export const aiService = USE_REAL_APIS ? new RealAiService() : new MockAiService();