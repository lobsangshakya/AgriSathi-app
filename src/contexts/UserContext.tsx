import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  address: string;
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
  isLoggedIn: boolean;
  login: (userData: Partial<User>) => void;
  logout: () => void;
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
  location: 'Bangalore, India',
  address: 'Bangalore, India',
  landSize: '2.5 एकड़',
  experience: '15 साल',
  agriCreds: 200, // Start with 200 credits for testing
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for existing user data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('agrisaathi_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userData: Partial<User>) => {
    const newUser = { ...defaultUser, ...userData };
    setUser(newUser);
    setIsLoggedIn(true);
          localStorage.setItem('agrisaathi_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('agrisaathi_user');
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
    localStorage.setItem('agrisaathi_user', JSON.stringify(updatedUser));

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
      localStorage.setItem('agrisaathi_user', JSON.stringify(userWithAchievements));
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
    localStorage.setItem('agrisaathi_user', JSON.stringify(updatedUser));

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
    localStorage.setItem('agrisaathi_user', JSON.stringify(updatedUser));
  };

  const value: UserContextType = {
    user,
    isLoggedIn,
    login,
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