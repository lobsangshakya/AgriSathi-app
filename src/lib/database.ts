import { supabase } from './supabaseClient';
import { User } from '@/contexts/UserContext';

// Database service for Supabase operations
export const database = {
  // User profiles
  profiles: {
    // Get user profile by ID
    getById: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      return { data, error };
    },

    // Create or update user profile
    upsert: async (profile: Partial<User>) => {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'id' })
        .select()
        .single();
      
      return { data, error };
    },

    // Update user profile
    update: async (userId: string, updates: Partial<User>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      return { data, error };
    }
  },

  // Crop recommendations
  cropRecommendations: {
    // Get crop recommendations based on location and season
    getByLocation: async (location: string, season?: string) => {
      let query = supabase
        .from('crop_recommendations')
        .select('*')
        .eq('location', location);
      
      if (season) {
        query = query.eq('season', season);
      }
      
      const { data, error } = await query;
      return { data, error };
    },

    // Get all crop recommendations
    getAll: async () => {
      const { data, error } = await supabase
        .from('crop_recommendations')
        .select('*');
      
      return { data, error };
    }
  },

  // Disease detection
  diseaseDetection: {
    // Save disease detection result
    saveResult: async (result: {
      user_id: string;
      image_url: string;
      disease_name: string;
      confidence: number;
      recommendations: string[];
      created_at?: string;
    }) => {
      const { data, error } = await supabase
        .from('disease_detections')
        .insert(result)
        .select()
        .single();
      
      return { data, error };
    },

    // Get user's disease detection history
    getHistory: async (userId: string) => {
      const { data, error } = await supabase
        .from('disease_detections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      return { data, error };
    }
  },

  // Community posts
  community: {
    // Get all community posts
    getPosts: async () => {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (name, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      return { data, error };
    },

    // Create new community post
    createPost: async (post: {
      user_id: string;
      title: string;
      content: string;
      category: string;
      image_url?: string;
    }) => {
      const { data, error } = await supabase
        .from('community_posts')
        .insert(post)
        .select()
        .single();
      
      return { data, error };
    },

    // Get post by ID
    getPostById: async (postId: string) => {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (name, avatar_url)
        `)
        .eq('id', postId)
        .single();
      
      return { data, error };
    }
  },

  // Expert consultations
  consultations: {
    // Get user's consultations
    getUserConsultations: async (userId: string) => {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          experts:expert_id (name, specialization, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      return { data, error };
    },

    // Create new consultation request
    createConsultation: async (consultation: {
      user_id: string;
      expert_id: string;
      subject: string;
      description: string;
      urgency: 'low' | 'medium' | 'high';
    }) => {
      const { data, error } = await supabase
        .from('consultations')
        .insert(consultation)
        .select()
        .single();
      
      return { data, error };
    }
  },

  // Weather data
  weather: {
    // Get weather data for location
    getByLocation: async (location: string) => {
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .eq('location', location)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      return { data, error };
    }
  },

  // File uploads
  storage: {
    // Upload image to storage
    uploadImage: async (file: File, path: string) => {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(path, file);
      
      return { data, error };
    },

    // Get public URL for image
    getPublicUrl: (path: string) => {
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(path);
      
      return data.publicUrl;
    }
  }
};

export default database; 