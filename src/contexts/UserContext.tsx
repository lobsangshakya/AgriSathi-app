/**
 * User Context - Real Authentication with Supabase
 * Manages user authentication state and profile data
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserProfile } from '@/services/authService';
import { handleToastError } from '@/utils/errorHandler';
import { toast } from '@/hooks/use-toast';

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
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUser: User = {
  id: '1',
  name: 'राम प्रकाश',
  location: 'उत्तर प्रदेश, भारत',
  avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
  email: 'ram.prakash@example.com',
  phone: '+91 98765 43210',
  landSize: '2.5 एकड़',
  experience: '15 साल',
  agriCreds: 200,
  joinDate: new Date().toLocaleDateString('hi-IN', { 
    year: 'numeric', 
    month: 'long' 
  }),
  language: 'hindi',
  crops: ['गेहूं', 'धान', 'गन्ना', 'सरसों'],
  stats: {
    postsShared: 0,
    helpfulAnswers: 0,
    questionsAsked: 0,
    creditsEarned: 0
  },
  achievements: []
};

/**
 * User Context Provider - Real Supabase Authentication
 */

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Transform UserProfile to User interface
  const transformProfile = (profile: UserProfile): User => ({
    id: profile.id,
    name: profile.name,
    location: profile.location,
    avatar: profile.avatar_url,
    email: profile.email,
    phone: profile.phone,
    landSize: profile.land_size,
    experience: profile.experience,
    agriCreds: profile.agri_creds,
    joinDate: profile.join_date,
    language: profile.language,
    crops: profile.crops,
    stats: {
      postsShared: 0, // Will be updated from database
      helpfulAnswers: 0,
      questionsAsked: 0,
      creditsEarned: profile.agri_creds,
    },
    achievements: [], // Will be fetched from database
  });

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const transformedUser = transformProfile(currentUser);
          setUser(transformedUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((profile) => {
      if (profile) {
        const transformedUser = transformProfile(profile);
        setUser(transformedUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Real login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.signIn(email, password);

      if (response.error) {
        toast({
          title: 'Login Failed',
          description: response.error,
          variant: 'destructive',
        });
        return false;
      }

      if (response.user) {
        const transformedUser = transformProfile(response.user);
        setUser(transformedUser);
        setIsLoggedIn(true);

        toast({
          title: 'Login Successful',
          description: `Welcome back, ${transformedUser.name}!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      handleToastError(error, toast);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Real sign up with email and password
  const signUp = async (email: string, password: string, userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.signUp(email, password, {
        name: userData.name || '',
        phone: userData.phone || '',
        location: userData.location || '',
        land_size: userData.landSize || '',
        experience: userData.experience || '',
        language: userData.language || 'hindi',
        crops: userData.crops || [],
        avatar_url: userData.avatar || '',
      });

      if (response.error) {
        toast({
          title: 'Sign Up Failed',
          description: response.error,
          variant: 'destructive',
        });
        return false;
      }

      if (response.user) {
        const transformedUser = transformProfile(response.user);
        setUser(transformedUser);
        setIsLoggedIn(true);

        toast({
          title: 'Sign Up Successful',
          description: `Welcome to AgriSathi, ${transformedUser.name}!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      handleToastError(error, toast);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Real logout
  const logout = async (): Promise<void> => {
    try {
      const response = await authService.signOut();

      if (response.error) {
        toast({
          title: 'Logout Failed',
          description: response.error,
          variant: 'destructive',
        });
        return;
      }

      setUser(null);
      setIsLoggedIn(false);

      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      handleToastError(error, toast);
    }
  };

  // Update user profile in database
  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;

      const profileUpdates = {
        name: updates.name,
        phone: updates.phone,
        location: updates.location,
        land_size: updates.landSize,
        experience: updates.experience,
        language: updates.language,
        crops: updates.crops,
        avatar_url: updates.avatar,
      };

      const response = await authService.updateProfile(profileUpdates);

      if (response.error) {
        toast({
          title: 'Update Failed',
          description: response.error,
          variant: 'destructive',
        });
        return false;
      }

      if (response.user) {
        const transformedUser = transformProfile(response.user);
        setUser(transformedUser);

        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated.',
        });
        return true;
      }

      return false;
    } catch (error) {
      handleToastError(error, toast);
      return false;
    }
  };

  // Sign up with phone and OTP
  const signUpWithPhone = async (phone: string, name: string, otp: string): Promise<boolean> => {
    const { language } = useLanguage();
    try {
      setIsLoading(true);
      const response = await authService.signUpWithPhone(phone, otp, {
        name,
        location: language === 'hindi' ? 'गाँव: रामपुर, जिला: मेरठ, उत्तर प्रदेश' : 'Village: Rampur, District: Meerut, UP',
        land_size: language === 'hindi' ? '2.5 एकड़' : '2.5 acres',
        experience: language === 'hindi' ? '15 साल' : '15 years',
        language: language,
        crops: language === 'hindi' ? ['गेहूं', 'धान', 'गन्ना', 'सरसों'] : ['Wheat', 'Rice', 'Sugarcane', 'Mustard'],
        avatar_url: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
      });

      if (response.error) {
        toast({
          title: 'Sign Up Failed',
          description: response.error,
          variant: 'destructive',
        });
        return false;
      }

      if (response.user) {
        const transformedUser = transformProfile(response.user);
        setUser(transformedUser);
        setIsLoggedIn(true);

        toast({
          title: 'Sign Up Successful',
          description: `Welcome to AgriSathi, ${transformedUser.name}!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      handleToastError(error, toast);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with phone and OTP
  const signInWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    const { language } = useLanguage();
    try {
      setIsLoading(true);
      const response = await authService.signInWithPhone(phone, otp);

      if (response.error) {
        toast({
          title: 'Login Failed',
          description: response.error,
          variant: 'destructive',
        });
        return false;
      }

      if (response.user) {
        const transformedUser = transformProfile(response.user);
        setUser(transformedUser);
        setIsLoggedIn(true);

        toast({
          title: 'Login Successful',
          description: `Welcome back, ${transformedUser.name}!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      handleToastError(error, toast);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP to phone
  const sendOTP = async (phone: string): Promise<boolean> => {
    const { language } = useLanguage();
    try {
      setIsLoading(true);
      const response = await authService.sendOTP(phone);

      if (response.error) {
        toast({
          title: 'OTP Send Failed',
          description: response.error,
          variant: 'destructive',
        });
        return false;
      }

      if (response.success) {
        toast({
          title: 'OTP Sent',
          description: language === 'hindi' 
            ? `OTP ${phone} पर भेज दिया गया है` 
            : `OTP has been sent to ${phone}`,
        });
        return true;
      }

      return false;
    } catch (error) {
      handleToastError(error, toast);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user data from database
  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const transformedUser = transformProfile(currentUser);
        setUser(transformedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  // Add AgriCreds (local state for now, will be moved to database)
  const addAgriCreds = (amount: number, reason: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      agriCreds: user.agriCreds + amount,
      stats: {
        ...user.stats,
        creditsEarned: user.stats.creditsEarned + amount
      }
    };

    setUser(updatedUser);

    // Add achievement if criteria met
    const newAchievements = [...updatedUser.achievements];
    
    if (updatedUser.agriCreds >= 100 && !newAchievements.find(a => a.title === 'Beginner Farmer')) {
      newAchievements.push({
        title: 'Beginner Farmer',
        points: 100,
        icon: '🌱'
      });
    }
    
    if (updatedUser.agriCreds >= 500 && !newAchievements.find(a => a.title === 'Community Contributor')) {
      newAchievements.push({
        title: 'Community Contributor',
        points: 500,
        icon: '🏆'
      });
    }
    
    if (updatedUser.agriCreds >= 1000 && !newAchievements.find(a => a.title === 'Expert Farmer')) {
      newAchievements.push({
        title: 'Expert Farmer',
        points: 1000,
        icon: '👨‍🌾'
      });
    }

    if (newAchievements.length > updatedUser.achievements.length) {
      const userWithAchievements = { ...updatedUser, achievements: newAchievements };
      setUser(userWithAchievements);
    }
  };

  // Update stats (local state for now)
  const updateStats = (type: 'post' | 'answer' | 'question') => {
    if (!user) return;

    const updatedUser = {
      ...user,
      stats: {
        ...user.stats,
        postsShared: type === 'post' ? user.stats.postsShared + 1 : user.stats.postsShared,
        helpfulAnswers: type === 'answer' ? user.stats.helpfulAnswers + 1 : user.stats.helpfulAnswers,
        questionsAsked: type === 'question' ? user.stats.questionsAsked + 1 : user.stats.questionsAsked
      }
    };

    setUser(updatedUser);

    // Add credits for actions
    const creditRewards = {
      post: 10,
      answer: 15,
      question: 5
    };

    addAgriCreds(creditRewards[type], `${type} action`);
  };

  const value: UserContextType = {
    user,
    isLoggedIn,
    isLoading,
    login,
    signUp,
    signUpWithPhone,
    signInWithPhone,
    sendOTP,
    logout,
    addAgriCreds,
    updateStats,
    updateUser,
    refreshUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};