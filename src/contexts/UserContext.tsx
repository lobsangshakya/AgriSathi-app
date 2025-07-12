import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
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
  achievements: Array<{
    title: string;
    points: number;
    icon: string;
  }>;
}

interface UserContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  signInWithOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addAgriCreds: (amount: number, reason: string) => void;
  updateStats: (type: 'post' | 'answer' | 'question') => void;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const defaultUser: User = {
  id: '1',
  name: 'राजेश कुमार',
  email: 'rajesh@example.com',
  phone: '+91 98765 43210',
  location: 'गाँव: रामपुर, जिला: मेरठ, उत्तर प्रदेश',
  landSize: '2.5 एकड़',
  experience: '15 साल',
  agriCreds: 0,
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

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user } = await auth.getCurrentUser();
        if (user) {
          setSupabaseUser(user);
          setIsLoggedIn(true);
          
          // Load user profile from Supabase or create default
          const userProfile = user.user_metadata || defaultUser;
          setUser({
            ...defaultUser,
            id: user.id,
            email: user.email || '',
            name: userProfile.name || defaultUser.name,
            phone: userProfile.phone || defaultUser.phone,
            location: userProfile.location || defaultUser.location,
            landSize: userProfile.landSize || defaultUser.landSize,
            experience: userProfile.experience || defaultUser.experience,
            language: userProfile.language || defaultUser.language,
            crops: userProfile.crops || defaultUser.crops,
            agriCreds: userProfile.agriCreds || 0,
            stats: userProfile.stats || defaultUser.stats,
            achievements: userProfile.achievements || []
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setSupabaseUser(session.user);
        setIsLoggedIn(true);
        
        const userProfile = session.user.user_metadata || defaultUser;
        setUser({
          ...defaultUser,
          id: session.user.id,
          email: session.user.email || '',
          name: userProfile.name || defaultUser.name,
          phone: userProfile.phone || defaultUser.phone,
          location: userProfile.location || defaultUser.location,
          landSize: userProfile.landSize || defaultUser.landSize,
          experience: userProfile.experience || defaultUser.experience,
          language: userProfile.language || defaultUser.language,
          crops: userProfile.crops || defaultUser.crops,
          agriCreds: userProfile.agriCreds || 0,
          stats: userProfile.stats || defaultUser.stats,
          achievements: userProfile.achievements || []
        });
      } else if (event === 'SIGNED_OUT') {
        setSupabaseUser(null);
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await auth.signIn(email, password);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { error } = await auth.signUp(email, password, userData);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Sign up failed' };
    }
  };

  const signInWithOtp = async (email: string) => {
    try {
      const { error } = await auth.signInWithOtp(email);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: 'OTP sign in failed' };
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
  };

  const value: UserContextType = {
    user,
    supabaseUser,
    isLoggedIn,
    isLoading,
    login,
    signUp,
    signInWithOtp,
    logout,
    addAgriCreds,
    updateStats,
    updateUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 