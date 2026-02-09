/**
 * Enhanced Dashboard with proper alignment, clean design, and smooth textures
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import QuickActionsEnhanced from '@/components/QuickActionsEnhanced';
import WeatherCardEnhanced from '@/components/WeatherCardEnhanced';
import { CropRecommendations } from '@/components/CropRecommendations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import EnhancedCard from '@/components/ui/enhanced-card';
import EnhancedButton from '@/components/ui/enhanced-button';
import EnhancedBadge from '@/components/ui/enhanced-badge';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Leaf, 
  Droplets, 
  Sun, 
  Wind, 
  Thermometer,
  Activity,
  Award,
  Target,
  Zap,
  ChevronRight
} from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: 'Crop Yield',
      value: '+15%',
      change: '+5%',
      icon: TrendingUp,
      color: 'success',
      trend: 'up'
    },
    {
      title: 'Active Users',
      value: '2.5K',
      change: '+120',
      icon: Users,
      color: 'info',
      trend: 'up'
    },
    {
      title: 'Crops',
      value: '50+',
      change: '+8',
      icon: Leaf,
      color: 'success',
      trend: 'up'
    },
    {
      title: 'Weather',
      value: '28°C',
      change: '+2°',
      icon: Sun,
      color: 'warning',
      trend: 'up'
    }
  ];

  const quickActions = [
    {
      title: 'Disease Detection',
      description: 'AI-powered crop health analysis',
      icon: '🔬',
      color: 'bg-gradient-to-br from-red-500 to-orange-500',
      href: '/disease-detection'
    },
    {
      title: 'Weather Forecast',
      description: 'Real-time weather updates',
      icon: '🌤',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      href: '/weather'
    },
    {
      title: 'Expert Chat',
      description: 'Connect with farming experts',
      icon: '💬',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      href: '/chat'
    },
    {
      title: 'Market Prices',
      description: 'Current market rates',
      icon: '💰',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      href: '/market'
    }
  ];

  const achievements = [
    {
      title: 'Beginner Farmer',
      points: 100,
      icon: '🌱',
      unlocked: true
    },
    {
      title: 'Crop Expert',
      points: 500,
      icon: '🌾',
      unlocked: false
    },
    {
      title: 'Community Leader',
      points: 1000,
      icon: '👨‍🌾',
      unlocked: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      <Header title={t('header.agrisathi')} />
      
      {/* Enhanced Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden mb-8"
      >
        <div className="relative h-64 md:h-80">
          <img 
            src={heroImage} 
            alt="Modern farming in India" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/20 to-black/60" />
          
          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-6 right-6"
          >
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-6 left-6"
          >
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30">
              <Leaf className="h-6 w-6 text-white" />
            </div>
          </motion.div>
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-6 max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                {t('dashboard.welcome') || 'Welcome to AgriSathi'}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg md:text-xl opacity-90"
              >
                {t('dashboard.subtitle') || 'Your smart farming companion'}
              </motion.p>
              
              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20"
                  >
                    <stat.icon className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-lg font-semibold">{stat.value}</div>
                    <div className="text-sm opacity-80">{stat.title}</div>
                    <div className="text-xs opacity-60 mt-1">{stat.change}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Enhanced Content Section */}
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <EnhancedCard variant="elevated" padding="lg" className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-3">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name || 'Farmer'}! 👋
                </h2>
                <p className="text-gray-600 mt-1">
                  Here's your farming overview for {currentTime.toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user?.agriCreds || 0}</div>
                <div className="text-sm text-gray-600">AgriCreds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{user?.stats?.postsShared || 0}</div>
                <div className="text-sm text-gray-600">Posts Shared</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user?.stats?.helpfulAnswers || 0}</div>
                <div className="text-sm text-gray-600">Helpful Answers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{user?.achievements?.length || 0}</div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
            </div>
          </EnhancedCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                >
                  <EnhancedCard variant="default" padding="lg" className="text-center cursor-pointer hover:scale-105 transition-transform">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-2xl ${action.color}`}>
                      {action.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </EnhancedCard>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Weather and Recommendations */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Weather Updates</h3>
              <WeatherCardEnhanced />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Crop Recommendations</h3>
              <CropRecommendations />
            </div>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <EnhancedCard variant="gradient" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Achievements</h3>
                  <p className="text-white/80">Your farming milestones</p>
                </div>
              </div>
              <EnhancedBadge variant="info" size="sm">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </EnhancedBadge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className={`text-center p-4 rounded-xl border ${
                    achievement.unlocked 
                      ? 'bg-white/20 border-white/30' 
                      : 'bg-white/5 border-white/10 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="font-semibold text-white">{achievement.title}</div>
                  <div className="text-sm text-white/80">{achievement.points} points</div>
                  {!achievement.unlocked && (
                    <div className="text-xs text-white/60 mt-2">🔒 Locked</div>
                  )}
                </motion.div>
              ))}
            </div>
          </EnhancedCard>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <EnhancedCard variant="default" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-gray-600">Your latest farming actions</p>
                </div>
              </div>
              <EnhancedButton variant="ghost" size="sm">
                View All
              </EnhancedButton>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Disease Check</div>
                    <div className="text-sm text-gray-600">Tomato plants - Healthy</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">2 hours ago</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Droplets className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Weather Check</div>
                    <div className="text-sm text-gray-600">Sunny, 28°C</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">4 hours ago</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Market Check</div>
                    <div className="text-sm text-gray-600">Tomato prices up</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">6 hours ago</div>
              </div>
            </div>
          </EnhancedCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
