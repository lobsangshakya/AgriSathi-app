/**
 * User Context - Authentication with Fallback Support
 * Manages user authentication state and profile data
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authWrapper, UnifiedUserProfile } from '@/services/authServiceWrapper';
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
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUser: User = {
  id: 'user-1',
  name: 'राम प्रकाश',
  location: 'गाँव: रामपुर, जिला: मेरठ, उत्तर प्रदेश',
  avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
  email: 'ramprakash@agrisathi.in',
  phone: '+91 98765 43210',
  landSize: '2.5 एकड़',
  experience: '15 साल',
  agriCreds: 250,
  joinDate: '2024-01-15',
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
 * User Context Provider - Authentication with Fallback Support
 */

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isHindi = language === 'hindi';

  // Transform UnifiedUserProfile to User interface
  const transformProfile = (profile: UnifiedUserProfile): User => ({
    id: profile.id,
    name: profile.name,
    location: profile.location,
    avatar: profile.avatar || profile.avatar_url || '',
    email: profile.email,
    phone: profile.phone,
    landSize: profile.landSize || profile.land_size || '',
    experience: profile.experience,
    agriCreds: profile.agriCreds || profile.agri_creds || 0,
    joinDate: profile.joinDate || profile.join_date || '',
    language: profile.language,
    crops: profile.crops,
    stats: {
      postsShared: 0, // Will be updated from database
      helpfulAnswers: 0,
      questionsAsked: 0,
      creditsEarned: profile.agriCreds || profile.agri_creds || 0,
    },
    achievements: [], // Will be fetched from database
  });

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authWrapper.getCurrentUser();
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
    const { data: { subscription } } = authWrapper.onAuthStateChange((profile) => {
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
      const response = await authWrapper.signIn(email, password);

      if (response.error) {
        toast({
          title: isHindi ? 'लॉगिन विफल' : 'Login Failed',
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
          title: isHindi ? 'लॉगिन सफल' : 'Login Successful',
          description: isHindi ? `वापस स्वागत है, ${transformedUser.name}!` : `Welcome back, ${transformedUser.name}!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      toast({
        title: isHindi ? 'लॉगिन विफल' : 'Login Failed',
        description: isHindi ? 'एक त्रुटि हुई' : 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Real sign up with email and password
  const signUp = async (email: string, password: string, userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authWrapper.signUp(email, password, userData);

      if (response.error) {
        toast({
          title: isHindi ? 'खाता बनाना विफल' : 'Sign Up Failed',
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
          title: isHindi ? 'खाता बन गया' : 'Sign Up Successful',
          description: isHindi ? `AgriSathi में स्वागत है, ${transformedUser.name}!` : `Welcome to AgriSathi, ${transformedUser.name}!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      toast({
        title: isHindi ? 'खाता बनाना विफल' : 'Sign Up Failed',
        description: isHindi ? 'एक त्रुटि हुई' : 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Real logout
  const logout = async (): Promise<void> => {
    try {
      const response = await authWrapper.signOut();

      if (response.error) {
        toast({
          title: isHindi ? 'लॉगआउट विफल' : 'Logout Failed',
          description: response.error,
          variant: 'destructive',
        });
        return;
      }

      setUser(null);
      setIsLoggedIn(false);

      toast({
        title: isHindi ? 'लॉगआउट हो गया' : 'Logged Out',
        description: isHindi ? 'आप सफलतापूर्वक लॉग आउट हो गए।' : 'You have been successfully logged out.',
      });
    } catch (error) {
      toast({
        title: isHindi ? 'लॉगआउट विफल' : 'Logout Failed',
        description: isHindi ? 'एक त्रुटि हुई' : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  // Update user profile
  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;

      const response = await authWrapper.updateProfile(updates);

      if (response.error) {
        toast({
          title: isHindi ? 'अपडेट विफल' : 'Update Failed',
          description: response.error,
          variant: 'destructive',
        });
        return false;
      }

      if (response.user) {
        const transformedUser = transformProfile(response.user);
        setUser(transformedUser);

        toast({
          title: isHindi ? 'प्रोफाइल अपडेट' : 'Profile Updated',
          description: isHindi ? 'आपकी प्रोफाइल अपडेट हो गई।' : 'Your profile has been successfully updated.',
        });
        return true;
      }

      return false;
    } catch (error) {
      toast({
        title: isHindi ? 'अपडेट विफल' : 'Update Failed',
        description: isHindi ? 'एक त्रुटि हुई' : 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authWrapper.getCurrentUser();
      if (currentUser) {
        const transformedUser = transformProfile(currentUser);
        setUser(transformedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  // Sign up with phone and OTP
  const signUpWithPhone = async (phone: string, name: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authWrapper.signUpWithPhone(phone, otp, {
        name,
        location: 'Village: Rampur, District: Meerut, UP',
        landSize: '2.5 acres',
        experience: '15 years',
        language: 'hindi',
        crops: ['Wheat', 'Rice', 'Sugarcane', 'Mustard'],
        avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
      });

      if (response.error) {
        toast({
          title: isHindi ? 'खाता बनाना विफल' : 'Sign Up Failed',
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
          title: isHindi ? 'खाता बन गया' : 'Sign Up Successful',
          description: isHindi ? `AgriSathi में स्वागत है, ${transformedUser.name}!` : `Welcome to AgriSathi, ${transformedUser.name}!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      toast({
        title: isHindi ? 'खाता बनाना विफल' : 'Sign Up Failed',
        description: isHindi ? 'एक त्रुटि हुई' : 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with phone and OTP
  const signInWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authWrapper.signInWithPhone(phone, otp);

      if (response.error) {
        toast({
          title: isHindi ? 'लॉगिन विफल' : 'Login Failed',
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
          title: isHindi ? 'लॉगिन सफल' : 'Login Successful',
          description: isHindi ? `वापस स्वागत है, ${transformedUser.name}!` : `Welcome back, ${transformedUser.name}!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      toast({
        title: isHindi ? 'लॉगिन विफल' : 'Login Failed',
        description: isHindi ? 'एक त्रुटि हुई' : 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP to phone
  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authWrapper.sendOTP(phone);

      if (response.error) {
        toast({
          title: isHindi ? 'OTP भेजना विफल' : 'OTP Send Failed',
          description: response.error,
          variant: 'destructive',
        });
        return false;
      }

      if (response.success) {
        toast({
          title: isHindi ? 'OTP भेजा गया' : 'OTP Sent',
          description: isHindi ? `OTP ${phone} पर भेजा गया` : `OTP has been sent to ${phone}`,
        });
        return true;
      }

      return false;
    } catch (error) {
      toast({
        title: isHindi ? 'OTP भेजना विफल' : 'OTP Send Failed',
        description: isHindi ? 'एक त्रुटि हुई' : 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
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
