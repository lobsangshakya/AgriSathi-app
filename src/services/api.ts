/**
 * API Configuration and Type Definitions
 * Central configuration for all API endpoints and data structures
 */

// API endpoints - can be overridden by environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.agrisathi.com';
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'https://ai.agrisathi.com';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Disease analysis result structure
 * Returned by plant disease detection API
 */
export interface DiseaseAnalysisResult {
  disease: string;              // Disease name (e.g., "Leaf Spot")
  confidence: number;            // Confidence percentage (0-100)
  severity: 'low' | 'medium' | 'high';  // Disease severity level
  recommendations: string[];    // Treatment recommendations
  preventiveMeasures: string[];  // Prevention measures
  treatment: string[];          // Treatment options
  scientificName?: string;       // Scientific name of disease
  symptoms: string[];           // Visible symptoms
}

/**
 * Chat message structure
 * Used for AI chatbot conversations
 */
export interface ChatMessage {
  id: string;                   // Unique message identifier
  sender: 'user' | 'bot';      // Message sender
  content: string;               // Message content
  timestamp: Date;              // Message timestamp
  type: 'text' | 'image' | 'voice';  // Message type
}

/**
 * Chat context for AI processing
 * Provides context for better AI responses
 */
export interface ChatContext {
  language: string;              // User's preferred language
  lastMessage?: string;          // Previous message for context
  nlpResult?: any;             // Natural language processing result
}

export interface WeatherData {
  location: string;
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
  location?: string;
}

export interface CreatePostRequest {
  content: string;
  image?: string;
  category: string;
  language?: string;
  location?: string;
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

// Check if we should use real APIs based on environment variables
const USE_REAL_APIS = import.meta.env.VITE_USE_MOCK_APIS === 'false' && (
  import.meta.env.VITE_OPENWEATHER_API_KEY ||
  import.meta.env.VITE_PLANT_ID_API_KEY ||
  import.meta.env.VITE_AGRICULTURE_API_KEY
);

// Export service instances with proper fallback
export const apiService = USE_REAL_APIS ? new RealApiService() : new MockApiService();
export const aiService = USE_REAL_APIS ? new RealAiService() : new MockAiService();

// Export configuration for debugging
export const apiConfig = {
  useRealApis: USE_REAL_APIS,
  baseUrl: API_BASE_URL,
  aiServiceUrl: AI_SERVICE_URL,
  hasWeatherKey: !!import.meta.env.VITE_OPENWEATHER_API_KEY,
  hasPlantIdKey: !!import.meta.env.VITE_PLANT_ID_API_KEY,
  hasAgricultureKey: !!import.meta.env.VITE_AGRICULTURE_API_KEY,
};