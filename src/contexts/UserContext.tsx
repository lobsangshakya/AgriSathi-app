/**
 * User Context - Authentication & Profile State
 * No Supabase dependency — works fully offline/mock
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UnifiedUserProfile } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

export interface Achievement { title: string; points: number; icon: string; }

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
  stats: { postsShared: number; helpfulAnswers: number; questionsAsked: number; creditsEarned: number; };
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
  locationData: { latitude: number; longitude: number; address?: string; isManual: boolean } | null;
  detectLocation: () => Promise<boolean>;
  setManualLocation: (lat: number, lon: number, address: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};

const convertToUser = (profile: UnifiedUserProfile): User => ({
  id: profile.id,
  name: profile.name,
  location: profile.location || 'Village: Unknown',
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
  email: profile.email,
  phone: profile.phone || '',
  landSize: profile.land_size || profile.landSize || 'Not specified',
  experience: profile.experience || 'Not specified',
  agriCreds: profile.agri_creds ?? 100,
  joinDate: (profile.join_date || profile.joinDate)
    ? new Date(profile.join_date || profile.joinDate!).toLocaleDateString()
    : new Date().toLocaleDateString(),
  language: profile.language || 'en',
  crops: profile.crops || [],
  stats: { postsShared: 0, helpfulAnswers: 0, questionsAsked: 0, creditsEarned: 0 },
  achievements: [],
});

const normalizePhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  const ten = digits.length >= 10 ? digits.slice(-10) : digits;
  return ten.length === 10 ? '+91' + ten : '+' + digits;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // false = show UI immediately
  const [locationData, setLocationData] = useState<UserContextType['locationData']>(null);

  const detectLocation = async (): Promise<boolean> => {
    if (!navigator.geolocation) return false;
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const loc = { latitude: coords.latitude, longitude: coords.longitude, isManual: false };
          setLocationData(loc);
          try { localStorage.setItem('agrisathi_location', JSON.stringify(loc)); } catch {}
          resolve(true);
        },
        () => resolve(false),
        { timeout: 8000 }
      );
    });
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
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
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
    const { data: { subscription } } = authService.onAuthStateChange(async (authUser) => {
      if (authUser) {
        setUser(convertToUser(authUser));
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await authService.signIn(email, password);
      if (result.user) {
        setUser(convertToUser(result.user));
        toast({ title: 'Login Successful', description: `Welcome back, ${result.user.name}!` });
        return true;
      }
      toast({ title: 'Login Failed', description: result.error || 'Invalid credentials', variant: 'destructive' });
      return false;
    } catch {
      toast({ title: 'Error', description: 'Login failed. Please try again.', variant: 'destructive' });
      return false;
    } finally { setIsLoading(false); }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await authService.signUp(email, password, userData);
      if (result.user) {
        setUser(convertToUser(result.user));
        toast({ title: 'Account Created', description: `Welcome to AgriSathi, ${result.user.name}!` });
        return true;
      }
      toast({ title: 'Sign Up Failed', description: result.error || 'Failed to create account', variant: 'destructive' });
      return false;
    } catch {
      toast({ title: 'Error', description: 'Sign up failed.', variant: 'destructive' });
      return false;
    } finally { setIsLoading(false); }
  };

  const signInWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await authService.signInWithPhone(normalizePhone(phone), otp);
      if (result.user) {
        setUser(convertToUser(result.user));
        toast({ title: 'Login Successful', description: `Welcome back, ${result.user.name}!` });
        return true;
      }
      toast({ title: 'OTP Failed', description: result.error || 'Invalid OTP', variant: 'destructive' });
      return false;
    } catch {
      toast({ title: 'Error', description: 'OTP verification failed.', variant: 'destructive' });
      return false;
    } finally { setIsLoading(false); }
  };

  const signUpWithPhone = async (phone: string, name: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const normalized = normalizePhone(phone);
      const result = await authService.signUpWithPhone(normalized, otp, { name, phone: normalized });
      if (result.user) {
        setUser(convertToUser(result.user));
        toast({ title: 'Account Created', description: `Welcome to AgriSathi, ${result.user.name}!` });
        return true;
      }
      toast({ title: 'Sign Up Failed', description: result.error || 'Failed to create account', variant: 'destructive' });
      return false;
    } catch {
      toast({ title: 'Error', description: 'Sign up failed.', variant: 'destructive' });
      return false;
    } finally { setIsLoading(false); }
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      const result = await authService.sendOTP(normalizePhone(phone));
      if (result.success) {
        toast({ title: 'OTP Sent', description: import.meta.env.DEV ? 'Use 123456 in dev mode' : 'Check your phone' });
        return true;
      }
      toast({ title: 'OTP Failed', description: result.error || 'Failed to send OTP', variant: 'destructive' });
      return false;
    } catch {
      toast({ title: 'Error', description: 'Failed to send OTP.', variant: 'destructive' });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try { await authService.signOut(); } catch {}
    setUser(null);
    setLocationData(null);
    try {
      localStorage.removeItem('agrisathi_mock_auth');
      localStorage.removeItem('agrisathi_location');
    } catch {}
    toast({ title: 'Logged Out' });
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    try {
      const result = await authService.updateProfile(updates);
      if (result.user) { setUser(convertToUser(result.user)); toast({ title: 'Profile Updated' }); return true; }
      toast({ title: 'Update Failed', description: result.error || 'Failed', variant: 'destructive' });
      return false;
    } catch { return false; }
  };

  const addAgriCreds = (amount: number, reason: string) => {
    setUser(prev => prev ? { ...prev, agriCreds: prev.agriCreds + amount } : null);
    toast({ title: 'Credits Earned', description: `+${amount}: ${reason}` });
  };

  const updateStats = (type: 'post' | 'answer' | 'question') => {
    setUser(prev => !prev ? null : {
      ...prev,
      agriCreds: prev.agriCreds + 10,
      stats: {
        ...prev.stats,
        postsShared: type === 'post' ? prev.stats.postsShared + 1 : prev.stats.postsShared,
        helpfulAnswers: type === 'answer' ? prev.stats.helpfulAnswers + 1 : prev.stats.helpfulAnswers,
        questionsAsked: type === 'question' ? prev.stats.questionsAsked + 1 : prev.stats.questionsAsked,
        creditsEarned: prev.stats.creditsEarned + 10,
      },
    });
  };

  const refreshUser = async () => {
    try {
      const current = await authService.getCurrentUser();
      if (current) setUser(convertToUser(current));
    } catch {}
  };

  return (
    <UserContext.Provider value={{
      user, isLoggedIn: !!user, isLoading,
      login, signUp, signUpWithPhone, signInWithPhone, sendOTP, logout,
      addAgriCreds, updateStats, updateUserProfile, refreshUser,
      locationData, detectLocation, setManualLocation,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
