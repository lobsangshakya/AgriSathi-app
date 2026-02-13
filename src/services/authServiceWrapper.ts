/**
 * Authentication Service Wrapper
 * Automatically falls back to mock authentication if Supabase fails
 */

import { authService, UserProfile, AuthResponse } from './authService';
import { mockAuthService, MockUserProfile, MockAuthResponse } from './mockAuthService';

// Unified user interface
export interface UnifiedUserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  location: string;
  landSize?: string;
  land_size?: string;
  experience: string;
  language: string;
  crops: string[];
  avatar?: string;
  avatar_url?: string;
  agriCreds?: number;
  agri_creds?: number;
  joinDate: string;
  join_date?: string;
}

// Unified auth response interface
export interface UnifiedAuthResponse {
  user: UnifiedUserProfile | null;
  session: any;
  error: string | null;
}

/**
 * Authentication Service Wrapper
 */
class AuthServiceWrapper {
  private useMock: boolean = false;

  constructor() {
    // Determine if we should use mock authentication
    this.useMock = import.meta.env.VITE_USE_MOCK_APIS === 'true' || !this.isSupabaseConfigured();
  }

  private isSupabaseConfigured(): boolean {
    return !!(
      import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_ANON_KEY &&
      import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-id.supabase.co'
    );
  }

  private transformMockUser(mockUser: MockUserProfile): UnifiedUserProfile {
    return {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      phone: mockUser.phone,
      location: mockUser.location,
      landSize: mockUser.landSize,
      land_size: mockUser.landSize,
      experience: mockUser.experience,
      language: mockUser.language,
      crops: mockUser.crops,
      avatar: mockUser.avatar,
      avatar_url: mockUser.avatar,
      agriCreds: mockUser.agriCreds,
      agri_creds: mockUser.agriCreds,
      joinDate: mockUser.joinDate,
      join_date: mockUser.joinDate,
    };
  }

  private transformSupabaseUser(supabaseUser: UserProfile): UnifiedUserProfile {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.name,
      phone: supabaseUser.phone,
      location: supabaseUser.location,
      landSize: supabaseUser.land_size,
      land_size: supabaseUser.land_size,
      experience: supabaseUser.experience,
      language: supabaseUser.language,
      crops: supabaseUser.crops,
      avatar: supabaseUser.avatar_url,
      avatar_url: supabaseUser.avatar_url,
      agriCreds: supabaseUser.agri_creds,
      agri_creds: supabaseUser.agri_creds,
      joinDate: supabaseUser.join_date,
      join_date: supabaseUser.join_date,
    };
  }

  /**
   * Sign up new user
   */
  async signUp(email: string, password: string, userData: Partial<UnifiedUserProfile>): Promise<UnifiedAuthResponse> {
    if (this.useMock) {
      const result = await mockAuthService.signUp(email, password, userData);
      return {
        user: result.user ? this.transformMockUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    }

    try {
      const result = await authService.signUp(email, password, userData);
      return {
        user: result.user ? this.transformSupabaseUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    } catch (error) {
      console.error('Supabase auth failed, falling back to mock:', error);
      const result = await mockAuthService.signUp(email, password, userData);
      return {
        user: result.user ? this.transformMockUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    }
  }

  /**
   * Sign in user
   */
  async signIn(email: string, password: string): Promise<UnifiedAuthResponse> {
    if (this.useMock) {
      const result = await mockAuthService.signIn(email, password);
      return {
        user: result.user ? this.transformMockUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    }

    try {
      const result = await authService.signIn(email, password);
      return {
        user: result.user ? this.transformSupabaseUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    } catch (error) {
      console.error('Supabase auth failed, falling back to mock:', error);
      const result = await mockAuthService.signIn(email, password);
      return {
        user: result.user ? this.transformMockUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<{ error: string | null }> {
    if (this.useMock) {
      return await mockAuthService.signOut();
    }

    try {
      return await authService.signOut();
    } catch (error) {
      console.error('Supabase signout failed, falling back to mock:', error);
      return await mockAuthService.signOut();
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<UnifiedUserProfile | null> {
    if (this.useMock) {
      const result = await mockAuthService.getCurrentUser();
      return result ? this.transformMockUser(result) : null;
    }

    try {
      const result = await authService.getCurrentUser();
      return result ? this.transformSupabaseUser(result) : null;
    } catch (error) {
      console.error('Supabase getCurrentUser failed, falling back to mock:', error);
      const result = await mockAuthService.getCurrentUser();
      return result ? this.transformMockUser(result) : null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<UnifiedUserProfile>): Promise<UnifiedAuthResponse> {
    if (this.useMock) {
      const result = await mockAuthService.updateProfile(updates);
      return {
        user: result.user ? this.transformMockUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    }

    try {
      const result = await authService.updateProfile(updates);
      return {
        user: result.user ? this.transformSupabaseUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    } catch (error) {
      console.error('Supabase updateProfile failed, falling back to mock:', error);
      const result = await mockAuthService.updateProfile(updates);
      return {
        user: result.user ? this.transformMockUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    }
  }

  /**
   * Send OTP
   */
  async sendOTP(phone: string): Promise<{ success: boolean; error: string | null }> {
    if (this.useMock) {
      return await mockAuthService.sendOTP(phone);
    }

    try {
      return await authService.sendOTP(phone);
    } catch (error) {
      console.error('Supabase sendOTP failed, falling back to mock:', error);
      return await mockAuthService.sendOTP(phone);
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; error: string | null }> {
    if (this.useMock) {
      return await mockAuthService.verifyOTP(phone, otp);
    }

    try {
      return await authService.verifyOTP(phone, otp);
    } catch (error) {
      console.error('Supabase verifyOTP failed, falling back to mock:', error);
      return await mockAuthService.verifyOTP(phone, otp);
    }
  }

  /**
   * Sign up with phone and OTP
   */
  async signUpWithPhone(phone: string, otp: string, userData: Partial<UnifiedUserProfile>): Promise<UnifiedAuthResponse> {
    if (this.useMock) {
      const result = await mockAuthService.signUpWithPhone(phone, otp, userData);
      return {
        user: result.user ? this.transformMockUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    }

    try {
      const result = await authService.signUpWithPhone(phone, otp, userData);
      return {
        user: result.user ? this.transformSupabaseUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    } catch (error) {
      console.error('Supabase signUpWithPhone failed, falling back to mock:', error);
      const result = await mockAuthService.signUpWithPhone(phone, otp, userData);
      return {
        user: result.user ? this.transformMockUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    }
  }

  /**
   * Sign in with phone and OTP
   */
  async signInWithPhone(phone: string, otp: string): Promise<UnifiedAuthResponse> {
    if (this.useMock) {
      const result = await mockAuthService.signInWithPhone(phone, otp);
      return {
        user: result.user ? this.transformMockUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    }

    try {
      const result = await authService.signInWithPhone(phone, otp);
      return {
        user: result.user ? this.transformSupabaseUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    } catch (error) {
      console.error('Supabase signInWithPhone failed, falling back to mock:', error);
      const result = await mockAuthService.signInWithPhone(phone, otp);
      return {
        user: result.user ? this.transformMockUser(result.user) : null,
        session: result.session,
        error: result.error,
      };
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: UnifiedUserProfile | null) => void) {
    if (this.useMock) {
      const subscription = mockAuthService.onAuthStateChange((mockUser) => {
        callback(mockUser ? this.transformMockUser(mockUser) : null);
      });
      return subscription;
    }

    try {
      const subscription = authService.onAuthStateChange((supabaseUser) => {
        callback(supabaseUser ? this.transformSupabaseUser(supabaseUser) : null);
      });
      return subscription;
    } catch (error) {
      console.error('Supabase onAuthStateChange failed, using mock:', error);
      const subscription = mockAuthService.onAuthStateChange((mockUser) => {
        callback(mockUser ? this.transformMockUser(mockUser) : null);
      });
      return subscription;
    }
  }
}

// Export singleton instance
export const authWrapper = new AuthServiceWrapper();
