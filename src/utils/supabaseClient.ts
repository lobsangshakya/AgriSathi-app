/**
 * Supabase Client Configuration
 * Created when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
 * Falls back to null (mock auth) when unconfigured.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const PLACEHOLDER_URL = 'https://your-project-id.supabase.co';

// A valid Supabase anon key is a JWT — it must start with "eyJ"
const urlMissing = !SUPABASE_URL || SUPABASE_URL === PLACEHOLDER_URL;
const keyMissing = !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'your-anon-key' || !SUPABASE_ANON_KEY.startsWith('eyJ');
const isConfigured = !urlMissing && !keyMissing;

if (!isConfigured) {
  const missingVars: string[] = [];
  if (urlMissing) missingVars.push('VITE_SUPABASE_URL');
  if (keyMissing) missingVars.push('VITE_SUPABASE_ANON_KEY');
  console.warn(`[AgriSathi] Supabase not configured: ${missingVars.join(', ')} is missing or placeholder`);
}

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Database types
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
