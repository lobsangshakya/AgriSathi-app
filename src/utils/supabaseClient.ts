/**
 * Supabase Database Client Configuration
 * Optional: only created when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
 * When not configured, app uses mock auth (no crash).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const PLACEHOLDER_URL = 'https://your-project-id.supabase.co';

const isConfigured =
  !!SUPABASE_URL &&
  !!SUPABASE_ANON_KEY &&
  SUPABASE_URL !== PLACEHOLDER_URL &&
  !String(SUPABASE_ANON_KEY).includes('your_');

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      realtime: { params: { eventsPerSecond: 10 } },
    })
  : null;

// Database types for TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string;
          location: string;
          land_size: string;
          experience: string;
          language: string;
          crops: string[];
          avatar_url: string;
          agri_creds: number;
          join_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          category: string;
          image_url?: string;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['community_posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['community_posts']['Row']>;
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          sender: 'user' | 'bot';
          type: 'text' | 'image' | 'voice';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['chat_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['chat_messages']['Row']>;
      };
    };
  };
};