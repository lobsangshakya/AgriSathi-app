import { database } from './database';
import { supabase } from './supabaseClient';

// Types for Community posts
export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  };
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
  image_url?: string;
}

// Types for Disease Detection
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

// Types for Chat
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

// Mock AI service for disease detection
export const aiService = {
  analyzeDisease: async (imageData: string, cropType?: string): Promise<DiseaseAnalysisResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock disease detection result
    const diseases = [
      {
        disease: 'Leaf Blight',
        confidence: 0.85,
        severity: 'medium' as const,
        recommendations: ['Remove infected leaves', 'Apply fungicide', 'Improve air circulation'],
        preventiveMeasures: ['Avoid overhead watering', 'Maintain proper spacing', 'Use resistant varieties'],
        treatment: ['Copper-based fungicide', 'Neem oil application', 'Prune affected areas'],
        scientificName: 'Alternaria solani',
        symptoms: ['Brown spots on leaves', 'Yellow halos around lesions', 'Leaf wilting']
      },
      {
        disease: 'Powdery Mildew',
        confidence: 0.92,
        severity: 'low' as const,
        recommendations: ['Increase air circulation', 'Reduce humidity', 'Apply sulfur-based treatment'],
        preventiveMeasures: ['Proper plant spacing', 'Avoid overhead irrigation', 'Use resistant cultivars'],
        treatment: ['Sulfur fungicide', 'Baking soda solution', 'Milk spray'],
        scientificName: 'Erysiphe cichoracearum',
        symptoms: ['White powdery spots', 'Leaf distortion', 'Stunted growth']
      },
      {
        disease: 'Root Rot',
        confidence: 0.78,
        severity: 'high' as const,
        recommendations: ['Improve drainage', 'Reduce watering frequency', 'Remove affected plants'],
        preventiveMeasures: ['Well-draining soil', 'Proper watering schedule', 'Avoid overwatering'],
        treatment: ['Remove infected roots', 'Apply fungicide', 'Repot with fresh soil'],
        scientificName: 'Phytophthora spp.',
        symptoms: ['Wilting despite adequate water', 'Brown/black roots', 'Stunted growth']
      }
    ];
    
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    return randomDisease;
  },
  processNaturalLanguage: async (text: string, language: string = 'hindi'): Promise<any> => {
    // Simulate NLP processing
    await new Promise(resolve => setTimeout(resolve, 500));
    return { intent: 'general', entities: [] };
  }
};

// Mock sendChatMessage for Chat page
export const sendChatMessage = async (message: string, context: ChatContext): Promise<ChatMessage> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  return {
    id: Date.now().toString(),
    sender: 'bot',
    content: context.language === 'hindi'
      ? 'यह एक डेमो उत्तर है। कृपया असली एपीआई के लिए सेटअप पूरा करें।'
      : 'This is a demo response. Please complete the real API setup.',
    timestamp: new Date(),
    type: 'text'
  };
};

// API service using Supabase
export const api = {
  // User profile operations
  profiles: {
    getCurrentUser: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated' };
      
      return database.profiles.getById(user.id);
    },

    updateProfile: async (updates: Record<string, unknown>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated' };
      
      return database.profiles.update(user.id, updates);
    }
  },

  // Crop recommendations
  cropRecommendations: {
    getByLocation: async (location: string, season?: string) => {
      return database.cropRecommendations.getByLocation(location, season);
    },

    getAll: async () => {
      return database.cropRecommendations.getAll();
    }
  },

  // Disease detection
  diseaseDetection: {
    saveResult: async (result: {
      image_url: string;
      disease_name: string;
      confidence: number;
      recommendations: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated' };
      
      return database.diseaseDetection.saveResult({
        user_id: user.id,
        ...result
      });
    },

    getHistory: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated' };
      
      return database.diseaseDetection.getHistory(user.id);
    }
  },

  // Community posts
  community: {
    getPosts: async (): Promise<CommunityPost[]> => {
      const { data, error } = await database.community.getPosts();
      if (error) throw error;
      return data || [];
    },

    createPost: async (post: CreatePostRequest) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated' };
      
      const { data, error } = await database.community.createPost({
        user_id: user.id,
        ...post
      });
      
      if (error) throw error;
      return { success: true, post: data, message: 'Post created successfully! +10 AgriCreds earned!' };
    },

    getPostById: async (postId: string) => {
      return database.community.getPostById(postId);
    },

    likePost: async (postId: string) => {
      // For now, return a mock success response
      // In a real implementation, you'd update the likes count in the database
      return { success: true, likes: Math.floor(Math.random() * 10) + 1 };
    }
  },

  // Expert consultations
  consultations: {
    getUserConsultations: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated' };
      
      return database.consultations.getUserConsultations(user.id);
    },

    createConsultation: async (consultation: {
      expert_id: string;
      subject: string;
      description: string;
      urgency: 'low' | 'medium' | 'high';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated' };
      
      return database.consultations.createConsultation({
        user_id: user.id,
        ...consultation
      });
    }
  },

  // Weather data
  weather: {
    getByLocation: async (location: string) => {
      return database.weather.getByLocation(location);
    }
  },

  // File uploads
  storage: {
    uploadImage: async (file: File, path: string) => {
      return database.storage.uploadImage(file, path);
    },

    getPublicUrl: (path: string) => {
      return database.storage.getPublicUrl(path);
    }
  },

  // Notifications
  notifications: {
    getUnread: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated' };
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false });
      
      return { data, error };
    },

    markAsRead: async (notificationId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: 'Not authenticated' };
      
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id)
        .select()
        .single();
      
      return { data, error };
    }
  }
};

export default api; 