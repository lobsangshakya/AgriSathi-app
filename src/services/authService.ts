/**
 * Authentication Service
 * Uses Supabase when configured, falls back to mock auth in dev mode.
 */

import { supabase } from '@/utils/supabaseClient';
import { AppError } from '@/utils/errorHandler';
import type { Session } from '@supabase/supabase-js';

const MOCK_AUTH_KEY = 'agrisathi_mock_auth';

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

// Alias kept for backward compatibility with UserContext
export type UnifiedUserProfile = UserProfile & {
  landSize?: string;
  joinDate?: string;
};

export interface AuthResponse {
  user: UserProfile | null;
  session: Session | null;
  error: string | null;
}

class AuthService {
  // ─── Dev bypass helper ────────────────────────────────────────────────────

  private mockAuthResponse(phone: string, name?: string): AuthResponse {
    const digits = phone.replace(/\D/g, '');
    const now = new Date().toISOString();
    const mockUser: UserProfile = {
      id: `mock-${digits}`,
      email: `${digits}@mock.agrisathi.dev`,
      name: name || 'Dev User',
      phone,
      location: 'Village: Dev, District: Test, UP',
      land_size: '2 acres',
      experience: '5 years',
      language: 'hindi',
      crops: ['Wheat', 'Rice'],
      avatar_url: '',
      agri_creds: 100,
      join_date: now,
      created_at: now,
      updated_at: now,
    };
    try {
      localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(mockUser));
    } catch {
      // localStorage unavailable (e.g. test env) — ignore
    }
    return { user: mockUser, session: null, error: null };
  }

  // ─── Email / password ─────────────────────────────────────────────────────

  async signUp(email: string, password: string, userData: Partial<UserProfile>): Promise<AuthResponse> {
    if (!supabase) {
      return { user: null, session: null, error: 'Authentication not configured. Please check your environment variables.' };
    }
    if (!email?.trim()) return { user: null, session: null, error: 'Email is required' };
    if (!password?.trim()) return { user: null, session: null, error: 'Password is required' };
    if (password.length < 6) return { user: null, session: null, error: 'Password must be at least 6 characters' };

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: userData.name, phone: userData.phone, ...userData } },
      });
      if (authError) throw new AppError(authError.message, 'SIGNUP_ERROR');
      if (!authData.user) return { user: null, session: null, error: 'Failed to create user account' };

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

      if (profileError) throw new AppError(profileError.message, 'PROFILE_CREATION_ERROR');
      return { user: profileData, session: authData.session, error: null };
    } catch (error) {
      return { user: null, session: null, error: error instanceof Error ? error.message : 'Signup failed' };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    if (!supabase) {
      return { user: null, session: null, error: 'Authentication not configured. Please check your environment variables.' };
    }
    if (!email?.trim()) return { user: null, session: null, error: 'Email is required' };
    if (!password?.trim()) return { user: null, session: null, error: 'Password is required' };

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw new AppError(authError.message, 'SIGNIN_ERROR');
      if (!authData.user) return { user: null, session: null, error: 'Failed to sign in' };

      const { data: profileData, error: profileError } = await supabase
        .from('users').select('*').eq('id', authData.user.id).single();
      if (profileError) throw new AppError(profileError.message, 'PROFILE_FETCH_ERROR');

      return { user: profileData, session: authData.session, error: null };
    } catch (error) {
      return { user: null, session: null, error: error instanceof Error ? error.message : 'Sign in failed' };
    }
  }

  // ─── Phone / OTP ──────────────────────────────────────────────────────────

  async sendOTP(phone: string): Promise<{ success: boolean; error: string | null }> {
    // Dev shortcut — no real SMS needed
    if (import.meta.env.DEV) {
      console.info(`[AgriSathi Dev] OTP for ${phone}: 123456`);
      return { success: true, error: null };
    }
    if (!supabase) return { success: false, error: 'Authentication not configured.' };
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const { error } = await supabase.from('otp_verifications').upsert(
        { phone, otp, expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), created_at: new Date().toISOString() },
        { onConflict: 'phone' }
      );
      if (error) throw new AppError(error.message, 'OTP_SEND_ERROR');
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to send OTP' };
    }
  }

  async signInWithPhone(phone: string, otp: string): Promise<AuthResponse> {
    // ── Dev bypass: any phone + OTP "123456" in dev mode ──
    if (import.meta.env.DEV && otp === '123456') {
      return this.mockAuthResponse(phone);
    }

    if (!supabase) {
      return { user: null, session: null, error: 'Authentication not configured. Please check your environment variables.' };
    }
    if (!phone?.trim()) return { user: null, session: null, error: 'Phone number is required' };
    if (!otp?.trim()) return { user: null, session: null, error: 'OTP is required' };

    try {
      const { data: otpData, error: otpError } = await supabase
        .from('otp_verifications')
        .select('*').eq('phone', phone).eq('otp', otp).eq('used', false)
        .gt('expires_at', new Date().toISOString()).single();

      if (otpError || !otpData) return { user: null, session: null, error: 'Invalid or expired OTP' };

      await supabase.from('otp_verifications').update({ used: true }).eq('id', otpData.id);

      const tempEmail = `${phone.replace(/\D/g, '')}@agrisathi.local`;
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: tempEmail, password: otp,
      });
      if (authError) throw new AppError(authError.message, 'PHONE_SIGNIN_ERROR');
      if (!authData.user) return { user: null, session: null, error: 'Failed to sign in' };

      const { data: profileData, error: profileError } = await supabase
        .from('users').select('*').eq('id', authData.user.id).single();
      if (profileError) throw new AppError(profileError.message, 'PROFILE_FETCH_ERROR');

      return { user: profileData, session: authData.session, error: null };
    } catch (error) {
      return { user: null, session: null, error: error instanceof Error ? error.message : 'Phone sign in failed' };
    }
  }

  async signUpWithPhone(phone: string, otp: string, userData: Partial<UserProfile>): Promise<AuthResponse> {
    // ── Dev bypass ──
    if (import.meta.env.DEV && otp === '123456') {
      return this.mockAuthResponse(phone, userData.name);
    }

    if (!supabase) {
      return { user: null, session: null, error: 'Authentication not configured. Please check your environment variables.' };
    }
    if (!phone?.trim()) return { user: null, session: null, error: 'Phone number is required' };
    if (!otp?.trim()) return { user: null, session: null, error: 'OTP is required' };
    if (!userData.name?.trim()) return { user: null, session: null, error: 'Name is required' };

    try {
      const tempEmail = `${phone.replace(/\D/g, '')}@agrisathi.local`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tempEmail, password: otp,
        options: { data: { name: userData.name, phone, signup_method: 'phone', ...userData } },
      });
      if (authError) throw new AppError(authError.message, 'PHONE_SIGNUP_ERROR');
      if (!authData.user) return { user: null, session: null, error: 'Failed to create user account' };

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: tempEmail,
          name: userData.name || '',
          phone,
          location: userData.location || '',
          land_size: userData.land_size || '',
          experience: userData.experience || '',
          language: userData.language || 'hindi',
          crops: userData.crops || [],
          avatar_url: userData.avatar_url || '',
          agri_creds: 0,
          join_date: new Date().toISOString(),
        })
        .select().single();

      if (profileError) throw new AppError(profileError.message, 'PROFILE_CREATION_ERROR');
      return { user: profileData, session: authData.session, error: null };
    } catch (error) {
      return { user: null, session: null, error: error instanceof Error ? error.message : 'Phone signup failed' };
    }
  }

  // ─── Session management ───────────────────────────────────────────────────

  async getCurrentUser(): Promise<UserProfile | null> {
    // Restore mock session when Supabase is not configured
    if (!supabase) {
      try {
        const stored = localStorage.getItem(MOCK_AUTH_KEY);
        if (stored) return JSON.parse(stored) as UserProfile;
      } catch {
        // ignore parse errors
      }
      return null;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data: profileData, error } = await supabase
        .from('users').select('*').eq('id', user.id).single();
      if (error) throw new AppError(error.message, 'USER_FETCH_ERROR');
      return profileData;
    } catch {
      return null;
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    // Clear mock session
    try { localStorage.removeItem(MOCK_AUTH_KEY); } catch { /* ignore */ }

    if (!supabase) return { error: null };
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new AppError(error.message, 'SIGNOUT_ERROR');
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign out failed' };
    }
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<{ user: UserProfile | null; error: string | null }> {
    if (!supabase) return { user: null, error: 'Authentication not configured.' };
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('No authenticated user', 'NO_USER_ERROR');
      const { data: profileData, error } = await supabase
        .from('users').update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id).select().single();
      if (error) throw new AppError(error.message, 'PROFILE_UPDATE_ERROR');
      return { user: profileData, error: null };
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Profile update failed' };
    }
  }

  async resetPassword(email: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'Authentication not configured.' };
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw new AppError(error.message, 'PASSWORD_RESET_ERROR');
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Password reset failed' };
    }
  }

  onAuthStateChange(callback: (user: UserProfile | null) => void) {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('users').select('*').eq('id', session.user.id).single();
        callback(profileData || null);
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
