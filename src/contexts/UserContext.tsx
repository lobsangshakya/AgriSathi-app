/**
 * Production-Ready User Context
 * Manages user authentication state and profile data with real APIs
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserProfile } from '@/services/authService';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

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

  // Convert UserProfile to User format
  const convertToUser = (profile: UserProfile): User => {
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
      joinDate: new Date(profile.created_at).toLocaleDateString(),
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

  // Initialize user on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const profile = await authService.getUserProfile(currentUser.id);
          if (profile) {
            setUser(convertToUser(profile));
          }
        }
      } catch (error) {
        // Silently handle initialization errors
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();

    // Listen to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (authUser) => {
      if (authUser) {
        const profile = await authService.getUserProfile(authUser.id);
        if (profile) {
          setUser(convertToUser(profile));
        }
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
      const result = await authService.signIn(email, password);
      
      if (result.success && result.user && result.profile) {
        setUser(convertToUser(result.profile));
        
        toast({
          title: t('auth.loginSuccess') || 'Login Successful',
          description: t('auth.welcomeBack') || `Welcome back, ${result.profile.name}!`,
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
      const result = await authService.signUp(email, password, userData);
      
      if (result.success && result.user && result.profile) {
        setUser(convertToUser(result.profile));
        
        toast({
          title: t('auth.signupSuccess') || 'Account Created',
          description: t('auth.welcome') || `Welcome to AgriSathi, ${result.profile.name}!`,
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
      const result = await authService.verifyPhoneOTP(phone, otp);
      
      if (result.success && result.user && result.profile) {
        setUser(convertToUser(result.profile));
        
        toast({
          title: t('auth.loginSuccess') || 'Login Successful',
          description: t('auth.welcomeBack') || `Welcome back, ${result.profile.name}!`,
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
    // For phone signup, we use the same OTP verification flow
    return signInWithPhone(phone, otp);
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      const result = await authService.signInWithPhone(phone);
      
      if (result.success) {
        toast({
          title: t('auth.otpSent') || 'OTP Sent',
          description: result.message || 'OTP has been sent to your phone number',
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
      const result = await authService.signOut();
      
      if (result.success) {
        setUser(null);
        
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
      const result = await authService.updateProfile(user.id, updates);
      
      if (result.success && result.profile) {
        setUser(convertToUser(result.profile));
        
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
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const profile = await authService.getUserProfile(currentUser.id);
        if (profile) {
          setUser(convertToUser(profile));
        }
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
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
