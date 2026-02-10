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
   * Send OTP to phone number
   */
  async sendOTP(phone: string): Promise<{ success: boolean; error: string | null }> {
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP with expiration (5 minutes)
      const { error } = await supabase
        .from('otp_verifications')
        .upsert({
          phone: phone,
          otp: otp,
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        }, {
          onConflict: 'phone'
        });

      if (error) {
        throw new AppError(error.message, 'OTP_SEND_ERROR');
      }

      // In production, integrate with SMS service like Twilio, MessageBird, etc.
      // For demo, we'll simulate SMS sending
      if (import.meta.env.DEV) console.info(`OTP sent to ${phone}: ${otp}`);
      
      // Show success message (in production, this would be sent via SMS)
      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP',
      };
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: otpData, error } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('phone', phone)
        .eq('otp', otp)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error) {
        throw new AppError(error.message, 'OTP_VERIFY_ERROR');
      }

      if (!otpData) {
        return {
          success: false,
          error: 'Invalid or expired OTP',
        };
      }

      // Mark OTP as used
      await supabase
        .from('otp_verifications')
        .update({ used: true })
        .eq('id', otpData.id);

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OTP verification failed',
      };
    }
  }

  /**
   * Sign up with phone and OTP
   */
  async signUpWithPhone(
    phone: string, 
    otp: string, 
    userData: Partial<UserProfile>
  ): Promise<AuthResponse> {
    try {
      // First verify OTP
      const otpVerification = await this.verifyOTP(phone, otp);
      
      if (!otpVerification.success) {
        return {
          user: null,
          session: null,
          error: otpVerification.error,
        };
      }

      // Create user with phone-based auth using email as identifier
      const tempEmail = `${phone}@agrisathi.local`;
      const tempPassword = otp; // Use OTP as temporary password
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tempEmail,
        password: tempPassword,
        options: {
          data: {
            name: userData.name,
            phone: phone,
            signup_method: 'phone',
          },
        },
      });

      if (authError) {
        throw new AppError(authError.message, 'PHONE_SIGNUP_ERROR');
      }

      if (authData.user) {
        // Create user profile in database
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: tempEmail,
            name: userData.name || '',
            phone: phone,
            location: userData.location || '',
            land_size: userData.land_size || '',
            experience: userData.experience || '',
            language: userData.language || 'hindi',
            crops: userData.crops || [],
            avatar_url: userData.avatar_url || '',
            agri_creds: 0,
            join_date: new Date().toISOString(),
            signup_method: 'phone',
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
        error: error instanceof Error ? error.message : 'Phone signup failed',
      };
    }
  }

  /**
   * Sign in with phone and OTP
   */
  async signInWithPhone(phone: string, otp: string): Promise<AuthResponse> {
    try {
      // First verify OTP
      const otpVerification = await this.verifyOTP(phone, otp);
      
      if (!otpVerification.success) {
        return {
          user: null,
          session: null,
          error: otpVerification.error,
        };
      }

      // For phone auth, we need to use a different approach since verifyOtp might not be available
      // Let's create a custom verification method
      const { data: otpData, error: otpError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('phone', phone)
        .eq('otp', otp)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (otpError || !otpData) {
        return {
          user: null,
          session: null,
          error: 'Invalid or expired OTP',
        };
      }

      // Mark OTP as used
      await supabase
        .from('otp_verifications')
        .update({ used: true })
        .eq('id', otpData.id);

      // Create or get user with phone-based auth
      // Since Supabase doesn't have built-in phone OTP, we'll use email as identifier
      const tempEmail = `${phone}@agrisathi.local`;
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: otp, // Use OTP as temporary password
      });

      if (authError) {
        throw new AppError(authError.message, 'PHONE_SIGNIN_ERROR');
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
        error: error instanceof Error ? error.message : 'Phone sign in failed',
      };
    }
  }
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
