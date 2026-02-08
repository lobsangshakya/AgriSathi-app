/**
 * Authentication Service
 * Handles all authentication operations with Supabase
 */

import { supabase, Database } from '@/utils/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { handleToastError, AppError } from '@/utils/errorHandler';

// User profile interface matching database schema
export interface UserProfile {
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
}

// Auth response interface
export interface AuthResponse {
  user: UserProfile | null;
  session: SupabaseUser | null;
  error: string | null;
}

/**
 * Authentication Service Class
 */
class AuthService {
  /**
   * Sign up new user with email and password
   */
  async signUp(email: string, password: string, userData: Partial<UserProfile>): Promise<AuthResponse> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
          },
        },
      });

      if (authError) {
        throw new AppError(authError.message, 'SIGNUP_ERROR');
      }

      if (authData.user) {
        // Create user profile in database
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            name: userData.name || '',
            phone: userData.phone || '',
            location: userData.location || '',
            land_size: userData.land_size || '',
            experience: userData.experience || '',
            language: userData.language || 'hindi',
            crops: userData.crops || [],
            avatar_url: userData.avatar_url || '',
            agri_creds: 0,
            join_date: new Date().toISOString(),
          })
          .select()
          .single();

        if (profileError) {
          // If profile creation fails, delete the auth user
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new AppError(profileError.message, 'PROFILE_CREATION_ERROR');
        }

        return {
          user: profileData,
          session: authData.user,
          error: null,
        };
      }

      return {
        user: null,
        session: null,
        error: 'Failed to create user account',
      };

    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Signup failed',
      };
    }
  }

  /**
   * Sign in user with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new AppError(authError.message, 'SIGNIN_ERROR');
      }

      if (authData.user) {
        // Fetch user profile from database
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          throw new AppError(profileError.message, 'PROFILE_FETCH_ERROR');
        }

        return {
          user: profileData,
          session: authData.user,
          error: null,
        };
      }

      return {
        user: null,
        session: null,
        error: 'Failed to sign in',
      };

    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Sign in failed',
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new AppError(error.message, 'SIGNOUT_ERROR');
      }

      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Sign out failed',
      };
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      // Fetch user profile from database
      const { data: profileData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw new AppError(error.message, 'USER_FETCH_ERROR');
      }

      return profileData;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<{ user: UserProfile | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new AppError('No authenticated user', 'NO_USER_ERROR');
      }

      const { data: profileData, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw new AppError(error.message, 'PROFILE_UPDATE_ERROR');
      }

      return {
        user: profileData,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : 'Profile update failed',
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new AppError(error.message, 'PASSWORD_RESET_ERROR');
      }

      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Password reset failed',
      };
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: UserProfile | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch user profile when auth state changes
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        callback(profileData || null);
      } else {
        callback(null);
      }
    });
  }
}

// Export singleton instance
export const authService = new AuthService();
