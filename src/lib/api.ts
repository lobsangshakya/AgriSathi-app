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

// Base API Service
class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Disease Detection API
  async analyzeDisease(imageData: string, cropType?: string): Promise<DiseaseAnalysisResult> {
    return this.request<DiseaseAnalysisResult>('/disease-detection', {
      method: 'POST',
      body: JSON.stringify({
        image: imageData,
        cropType,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  // Chatbot API
  async sendChatMessage(message: string, context?: ChatContext): Promise<ChatMessage> {
    return this.request<ChatMessage>('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  // Weather API
  async getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    return this.request<WeatherData>(`/weather?lat=${latitude}&lon=${longitude}`);
  }

  // Crop Recommendations API
  async getCropRecommendations(
    soilType: string,
    season: string,
    location: string
  ): Promise<CropRecommendation[]> {
    return this.request<CropRecommendation[]>('/crop-recommendations', {
      method: 'POST',
      body: JSON.stringify({
        soilType,
        season,
        location,
      }),
    });
  }

  // Expert Consultation API
  async getAvailableExperts(): Promise<any[]> {
    return this.request<any[]>('/experts');
  }

  async bookExpertConsultation(
    expertId: string,
    userId: string,
    dateTime: string
  ): Promise<any> {
    return this.request<any>('/experts/book', {
      method: 'POST',
      body: JSON.stringify({
        expertId,
        userId,
        dateTime,
      }),
    });
  }

  // Market Prices API
  async getMarketPrices(crop?: string): Promise<any[]> {
    const endpoint = crop ? `/market-prices?crop=${crop}` : '/market-prices';
    return this.request<any[]>(endpoint);
  }

  // Soil Analysis API
  async analyzeSoil(imageData: string): Promise<any> {
    return this.request<any>('/soil-analysis', {
      method: 'POST',
      body: JSON.stringify({
        image: imageData,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  // Community Posts API
  async getCommunityPosts(language: string = 'hindi'): Promise<CommunityPost[]> {
    return this.request<CommunityPost[]>(`/community/posts?language=${language}`);
  }

  async createPost(postData: CreatePostRequest): Promise<PostResponse> {
    return this.request<PostResponse>('/community/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId: string): Promise<any> {
    return this.request<any>(`/community/posts/${postId}/like`, {
      method: 'POST',
    });
  }
}

// AI Service for advanced features
class AIService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${AI_SERVICE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_AI_API_KEY}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`AI Service Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('AI Service Request failed:', error);
      throw error;
    }
  }

  // Advanced disease detection with multiple models
  async advancedDiseaseDetection(imageData: string): Promise<DiseaseAnalysisResult> {
    return this.request<DiseaseAnalysisResult>('/disease-detection/advanced', {
      method: 'POST',
      body: JSON.stringify({
        image: imageData,
        models: ['resnet50', 'efficientnet', 'vit'],
        confidence_threshold: 0.8,
      }),
    });
  }

  // Natural language processing for chatbot
  async processNaturalLanguage(text: string, language: string = 'hindi'): Promise<any> {
    return this.request<any>('/nlp/process', {
      method: 'POST',
      body: JSON.stringify({
        text,
        language,
        context: 'agriculture',
      }),
    });
  }

  // Image preprocessing for better analysis
  async preprocessImage(imageData: string): Promise<string> {
    return this.request<{ processed_image: string }>('/image/preprocess', {
      method: 'POST',
      body: JSON.stringify({
        image: imageData,
        operations: ['enhance', 'normalize', 'resize'],
      }),
    }).then(result => result.processed_image);
  }
}

// Import mock and real services
import { MockApiService, MockAiService } from './mockApi';
import { RealApiService, RealAiService } from './realApi';

// Check if we're in development mode or if real APIs are not available
const USE_MOCK_APIS = import.meta.env.DEV || !import.meta.env.VITE_API_BASE_URL;
const USE_REAL_APIS = !USE_MOCK_APIS && (
  import.meta.env.VITE_OPENWEATHER_API_KEY || 
  import.meta.env.VITE_PLANT_ID_API_KEY || 
  import.meta.env.VITE_AGRICULTURE_API_KEY
);

// Export instances
export const apiService = USE_REAL_APIS ? new RealApiService() : new MockApiService();
export const aiService = USE_REAL_APIS ? new RealAiService() : new MockAiService();

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