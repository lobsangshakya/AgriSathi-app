/**
 * Production-Ready User Context
 * Manages user authentication state and profile data with real APIs
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authWrapper, UnifiedUserProfile } from '@/services/authServiceWrapper';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { env } from '@/lib/env';

export interface Achievement {
  title: string;
  points: number;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  location: string;
  avatar: string;
  email: string;
  phone: string;
  landSize: string;
  experience: string;
  agriCreds: number;
  joinDate: string;
  language: string;
  crops: string[];
  stats: {
    postsShared: number;
    helpfulAnswers: number;
    questionsAsked: number;
    creditsEarned: number;
  };
  achievements: Achievement[];
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<boolean>;
  signUpWithPhone: (phone: string, name: string, otp: string) => Promise<boolean>;
  signInWithPhone: (phone: string, otp: string) => Promise<boolean>;
  sendOTP: (phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addAgriCreds: (amount: number, reason: string) => void;
  updateStats: (type: 'post' | 'answer' | 'question') => void;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  locationData: {
    latitude: number;
    longitude: number;
    address?: string;
    isManual: boolean;
  } | null;
  detectLocation: () => Promise<boolean>;
  setManualLocation: (lat: number, lon: number, address: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language, t } = useLanguage();

  // Location State
  const [locationData, setLocationData] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
    isManual: boolean;
  } | null>(null);

  // Convert UnifiedUserProfile to User format
  const convertToUser = (profile: UnifiedUserProfile): User => {
    return {
      id: profile.id,
      name: profile.name,
      location: profile.location || 'Village: Unknown, District: Unknown',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
      email: profile.email,
      phone: profile.phone || '',
      landSize: profile.landSize || 'Not specified',
      experience: profile.experience || 'Not specified',
      agriCreds: 100, // Default credits
      joinDate: new Date(profile.joinDate).toLocaleDateString(),
      language: profile.language,
      crops: profile.crops,
      stats: {
        postsShared: 0,
        helpfulAnswers: 0,
        questionsAsked: 0,
        creditsEarned: 0,
      },
      achievements: [],
    };
  };

  // Helper to normalize phone numbers for consistently
  const normalizePhone = (rawPhone: string): string => {
    const digits = rawPhone.replace(/\D/g, '');
    const tenDigits = digits.length >= 10 ? digits.slice(-10) : digits;
    return tenDigits.length === 10 ? '+91' + tenDigits : '+' + digits;
  };

  const detectLocation = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      toast({
        title: t('common.error') || 'Error',
        description: 'Geolocation is not supported by your browser',
        variant: 'destructive',
      });
      return false;
    }

    try {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Basic reverse geocoding (mock for now, or use weatherService if available)
            // In a real app, we'd call a geocoding API here
            const newLocation = {
              latitude,
              longitude,
              isManual: false
            };

            setLocationData(newLocation);
            localStorage.setItem('agrisathi_location', JSON.stringify(newLocation));

            toast({
              title: t('location.detected') || 'Location Detected',
              description: t('location.usingCurrent') || 'Using your current location',
            });
            resolve(true);
          },
          (error) => {
            // Silently handle - location is optional
            resolve(false);
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      });
    } catch (error) {
      return false;
    }
  };

  const setManualLocation = (lat: number, lon: number, address: string) => {
    const newLocation = {
      latitude: lat,
      longitude: lon,
      address,
      isManual: true
    };
    setLocationData(newLocation);
    localStorage.setItem('agrisathi_location', JSON.stringify(newLocation));

    toast({
      title: t('location.updated') || 'Location Updated',
      description: `${t('location.setto') || 'Set to'}: ${address}`,
    });
  };

  // Initialize user and location on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const currentUser = await authWrapper.getCurrentUser();
        if (currentUser) {
          // In authWrapper, getCurrentUser returns the unified profile directly
          setUser(convertToUser(currentUser));
        }

        // Load saved location from localStorage
        const savedLocation = localStorage.getItem('agrisathi_location');
        if (savedLocation) {
          setLocationData(JSON.parse(savedLocation));
        } else {
          // Auto-detect if no saved location
          detectLocation();
        }
      } catch (error) {
        // Silently handle initialization errors
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();

    // Listen to auth state changes
    const { data: { subscription } } = authWrapper.onAuthStateChange(async (authUser) => {
      if (authUser) {
        // authWrapper returns the profile directly
        setUser(convertToUser(authUser));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await authWrapper.signIn(email, password);

      if (result.user) {
        setUser(convertToUser(result.user));

        toast({
          title: t('auth.loginSuccess') || 'Login Successful',
          description: t('auth.welcomeBack') || `Welcome back, ${result.user.name}!`,
        });

        return true;
      } else {
        toast({
          title: t('auth.loginFailed') || 'Login Failed',
          description: result.error || 'Invalid credentials',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: t('auth.error') || 'Error',
        description: t('auth.loginError') || 'Login failed. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await authWrapper.signUp(email, password, userData);

      if (result.user) {
        setUser(convertToUser(result.user));

        toast({
          title: t('auth.signupSuccess') || 'Account Created',
          description: t('auth.welcome') || `Welcome to AgriSathi, ${result.user.name}!`,
        });

        return true;
      } else {
        toast({
          title: t('auth.signupFailed') || 'Sign Up Failed',
          description: result.error || 'Failed to create account',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: t('auth.error') || 'Error',
        description: t('auth.signupError') || 'Sign up failed. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const normalizedPhone = normalizePhone(phone);
      const result = await authWrapper.signInWithPhone(normalizedPhone, otp);

      if (result.user) {
        setUser(convertToUser(result.user));

        toast({
          title: t('auth.loginSuccess') || 'Login Successful',
          description: t('auth.welcomeBack') || `Welcome back, ${result.user.name}!`,
        });

        return true;
      } else {
        toast({
          title: t('auth.otpFailed') || 'OTP Verification Failed',
          description: result.error || 'Invalid OTP',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: t('auth.error') || 'Error',
        description: t('auth.otpError') || 'OTP verification failed. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithPhone = async (phone: string, name: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const normalizedPhone = normalizePhone(phone);
      const result = await authWrapper.signUpWithPhone(normalizedPhone, otp, { name, phone: normalizedPhone });

      if (result.user) {
        setUser(convertToUser(result.user));

        toast({
          title: t('auth.signupSuccess') || 'Account Created',
          description: t('auth.welcome') || `Welcome to AgriSathi, ${result.user.name}!`,
        });

        return true;
      } else {
        toast({
          title: t('auth.signupFailed') || 'Sign Up Failed',
          description: result.error || 'Failed to create account',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: t('auth.error') || 'Error',
        description: t('auth.signupError') || 'Sign up failed. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      const normalizedPhone = normalizePhone(phone);
      const result = await authWrapper.sendOTP(normalizedPhone);

      if (result.success) {
        toast({
          title: t('auth.otpSent') || 'OTP Sent',
          description: 'OTP has been sent to your phone number' + (env.DEV ? ' (Check console for code)' : ''),
        });
        return true;
      } else {
        toast({
          title: t('auth.otpFailed') || 'OTP Failed',
          description: result.error || 'Failed to send OTP',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: t('auth.error') || 'Error',
        description: t('auth.otpError') || 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const result = await authWrapper.signOut();

      // Always clear local state and storage on logout attempt
      setUser(null);
      setLocationData(null);
      localStorage.removeItem('agrisathi_mock_auth');
      localStorage.removeItem('agrisathi_location');

      if (!result.error) {
        toast({
          title: t('auth.logoutSuccess') || 'Logged Out',
          description: t('auth.logoutMessage') || 'You have been logged out successfully',
        });
      } else {
        toast({
          title: t('auth.error') || 'Error',
          description: result.error || 'Logout failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      // Even on error, force clear local state
      setUser(null);
      setLocationData(null);
      localStorage.removeItem('agrisathi_mock_auth');
      localStorage.removeItem('agrisathi_location');

      toast({
        title: t('auth.error') || 'Error',
        description: t('auth.logoutError') || 'Logout failed. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addAgriCreds = (amount: number, reason: string) => {
    if (user) {
      setUser(prev => prev ? {
        ...prev,
        agriCreds: prev.agriCreds + amount,
      } : null);

      toast({
        title: t('credits.earned') || 'Credits Earned',
        description: `${amount} credits earned: ${reason}`,
      });
    }
  };

  const updateStats = (type: 'post' | 'answer' | 'question') => {
    if (user) {
      setUser(prev => prev ? {
        ...prev,
        stats: {
          ...prev.stats,
          postsShared: type === 'post' ? prev.stats.postsShared + 1 : prev.stats.postsShared,
          helpfulAnswers: type === 'answer' ? prev.stats.helpfulAnswers + 1 : prev.stats.helpfulAnswers,
          questionsAsked: type === 'question' ? prev.stats.questionsAsked + 1 : prev.stats.questionsAsked,
          creditsEarned: prev.stats.creditsEarned + 10,
        },
        agriCreds: prev.agriCreds + 10,
      } : null);
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const result = await authWrapper.updateProfile(updates);

      if (result.user) {
        setUser(convertToUser(result.user));

        toast({
          title: t('profile.updated') || 'Profile Updated',
          description: t('profile.updateSuccess') || 'Your profile has been updated successfully',
        });

        return true;
      } else {
        toast({
          title: t('profile.updateFailed') || 'Update Failed',
          description: result.error || 'Failed to update profile',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: t('auth.error') || 'Error',
        description: t('profile.updateError') || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authWrapper.getCurrentUser();
      if (currentUser) {
        setUser(convertToUser(currentUser));
      }
    } catch (error) {
      // Silently handle refresh errors
    }
  };

  const value: UserContextType = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    signUp,
    signUpWithPhone,
    signInWithPhone,
    sendOTP,
    logout,
    addAgriCreds,
    updateStats,
    updateUserProfile,
    refreshUser,
    locationData,
    detectLocation,
    setManualLocation
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
