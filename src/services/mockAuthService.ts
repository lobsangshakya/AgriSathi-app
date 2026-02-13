/**
 * Mock Authentication Service
 * Provides working authentication with real SMS OTP delivery
 */

import { smsService } from './smsService';

// Mock user profile interface
export interface MockUserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  location: string;
  landSize: string;
  experience: string;
  language: string;
  crops: string[];
  avatar: string;
  agriCreds: number;
  joinDate: string;
}

// Mock auth response interface
export interface MockAuthResponse {
  user: MockUserProfile | null;
  session: string | null;
  error: string | null;
}

/**
 * Mock Authentication Service Class
 */
class MockAuthService {
  private storageKey = 'agrisathi_mock_auth';
  private users: MockUserProfile[] = [];

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    const stored = localStorage.getItem('agrisathi_mock_users');
    if (stored) {
      this.users = JSON.parse(stored);
    }
  }

  private saveUsers() {
    localStorage.setItem('agrisathi_mock_users', JSON.stringify(this.users));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Sign up new user with email and password
   */
  async signUp(email: string, password: string, userData: Partial<MockUserProfile>): Promise<MockAuthResponse> {
    try {
      // Check if user already exists
      const existingUser = this.users.find(u => u.email === email);
      if (existingUser) {
        return {
          user: null,
          session: null,
          error: 'User with this email already exists',
        };
      }

      // Create new user
      const newUser: MockUserProfile = {
        id: this.generateId(),
        email,
        name: userData.name || '',
        phone: userData.phone || '',
        location: userData.location || '',
        landSize: userData.landSize || '',
        experience: userData.experience || '',
        language: userData.language || 'hindi',
        crops: userData.crops || [],
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
        agriCreds: 0,
        joinDate: new Date().toISOString(),
      };

      this.users.push(newUser);
      this.saveUsers();

      // Create session
      const session = this.generateId();
      this.saveSession(newUser, session);

      return {
        user: newUser,
        session,
        error: null,
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
  async signIn(email: string, password: string): Promise<MockAuthResponse> {
    try {
      // Find user by email
      const user = this.users.find(u => u.email === email);
      if (!user) {
        return {
          user: null,
          session: null,
          error: 'User not found',
        };
      }

      // Create session (mock password validation)
      const session = this.generateId();
      this.saveSession(user, session);

      return {
        user,
        session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      localStorage.removeItem(this.storageKey);
      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Logout failed',
      };
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<MockUserProfile | null> {
    try {
      const sessionData = localStorage.getItem(this.storageKey);
      if (!sessionData) return null;

      const { user } = JSON.parse(sessionData);
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<MockUserProfile>): Promise<MockAuthResponse> {
    try {
      const sessionData = localStorage.getItem(this.storageKey);
      if (!sessionData) {
        return {
          user: null,
          session: null,
          error: 'No active session',
        };
      }

      const { user, session } = JSON.parse(sessionData);
      const userIndex = this.users.findIndex(u => u.id === user.id);

      if (userIndex === -1) {
        return {
          user: null,
          session: null,
          error: 'User not found',
        };
      }

      // Update user
      const updatedUser = { ...this.users[userIndex], ...updates };
      this.users[userIndex] = updatedUser;
      this.saveUsers();
      this.saveSession(updatedUser, session);

      return {
        user: updatedUser,
        session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Profile update failed',
      };
    }
  }

  /**
   * Send OTP (real SMS implementation)
   */
  async sendOTP(phone: string): Promise<{ success: boolean; error: string | null }> {
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP in localStorage for verification
      localStorage.setItem(`otp_${phone}`, JSON.stringify({
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      }));

      // Send OTP via SMS service
      const smsResult = await smsService.sendOTP(phone, otp);


      // Log OTP for development
      // Log OTP for development
      console.log(`[MockAuthService] Generated OTP for ${phone}: ${otp}`);

      if (smsResult.success) {
        return {
          success: true,
          error: null,
        };
      } else {
        return {
          success: false,
          error: smsResult.error || 'Failed to send SMS',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP',
      };
    }
  }

  /**
   * Verify OTP (mock implementation)
   */
  async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const otpData = localStorage.getItem(`otp_${phone}`);
      if (!otpData) {
        return {
          success: false,
          error: 'OTP not found',
        };
      }

      const { otp: storedOtp, expiresAt } = JSON.parse(otpData);

      // Diagnostic logging
      console.log(`[MockAuthService] Verifying OTP for ${phone}: received=${otp}, stored=${storedOtp}`);

      if (new Date() > new Date(expiresAt)) {
        localStorage.removeItem(`otp_${phone}`);
        return {
          success: false,
          error: 'OTP expired',
        };
      }

      if (storedOtp !== otp) {
        return {
          success: false,
          error: `Invalid OTP (Received: ${otp})`,
        };
      }

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
  async signUpWithPhone(phone: string, otp: string, userData: Partial<MockUserProfile>): Promise<MockAuthResponse> {
    try {
      // Verify OTP first
      const otpVerification = await this.verifyOTP(phone, otp);
      if (!otpVerification.success) {
        return {
          user: null,
          session: null,
          error: otpVerification.error,
        };
      }

      // If we reach here, OTP is valid. Only now remove it.
      localStorage.removeItem(`otp_${phone}`);

      // Check if user already exists
      const existingUser = this.users.find(u => u.phone === phone);
      if (existingUser) {
        return {
          user: null,
          session: null,
          error: 'User with this phone number already exists',
        };
      }

      // Create new user
      const newUser: MockUserProfile = {
        id: this.generateId(),
        email: `${phone}@agrisathi.local`,
        name: userData.name || '',
        phone,
        location: userData.location || '',
        landSize: userData.landSize || '',
        experience: userData.experience || '',
        language: userData.language || 'hindi',
        crops: userData.crops || [],
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
        agriCreds: 0,
        joinDate: new Date().toISOString(),
      };

      this.users.push(newUser);
      this.saveUsers();

      // Create session
      const session = this.generateId();
      this.saveSession(newUser, session);

      return {
        user: newUser,
        session,
        error: null,
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
  async signInWithPhone(phone: string, otp: string): Promise<MockAuthResponse> {
    try {
      // Verify OTP first
      const otpVerification = await this.verifyOTP(phone, otp);
      if (!otpVerification.success) {
        return {
          user: null,
          session: null,
          error: otpVerification.error,
        };
      }

      // If we reach here, OTP is valid. Only now remove it.
      localStorage.removeItem(`otp_${phone}`);

      // Find user by phone
      const user = this.users.find(u => u.phone === phone);
      if (!user) {
        return {
          user: null,
          session: null,
          error: 'User not found',
        };
      }

      // Create session
      const session = this.generateId();
      this.saveSession(user, session);

      return {
        user,
        session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Phone login failed',
      };
    }
  }

  /**
   * Listen to auth state changes (mock implementation)
   */
  onAuthStateChange(callback: (user: MockUserProfile | null) => void) {
    // Return a mock subscription object
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            // Mock unsubscribe
          },
        },
      },
    };
  }

  private saveSession(user: MockUserProfile, session: string) {
    localStorage.setItem(this.storageKey, JSON.stringify({
      user,
      session,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }));
  }
}

// Export singleton instance
export const mockAuthService = new MockAuthService();
