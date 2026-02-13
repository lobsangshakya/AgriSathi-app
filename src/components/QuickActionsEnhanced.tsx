/**
 * Enhanced Quick Actions Component with proper alignment and smooth textures
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EnhancedCard from '@/components/ui/enhanced-card';
import EnhancedButton from '@/components/ui/enhanced-button';
import { 
  Camera, 
  MessageSquare, 
  Droplets, 
  TrendingUp, 
  Users, 
  Leaf,
  Zap,
  Target,
  Activity
} from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  badge?: string;
}

const QuickActionsEnhanced = () => {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      title: 'Disease Detection',
      description: 'AI-powered crop health analysis',
      icon: '',
      color: 'bg-gradient-to-br from-red-500 to-orange-500',
      href: '/disease-detection',
      badge: 'AI'
    },
    {
      title: 'Weather Forecast',
      description: 'Real-time weather updates',
      icon: '',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      href: '/weather',
      badge: 'Live'
    },
    {
      title: 'Expert Chat',
      description: 'Connect with farming experts',
      icon: '',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      href: '/chat',
      badge: 'Online'
    },
    {
      title: 'Market Prices',
      description: 'Current market rates',
      icon: '',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      href: '/market',
      badge: 'Updated'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
        <EnhancedButton variant="ghost" size="sm">
          View All
        </EnhancedButton>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onClick={() => navigate(action.href)}
          >
            <EnhancedCard 
              variant="glass" 
              padding="md" 
              className="text-center cursor-pointer hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl ${action.color} shadow-lg`}>
                  {action.icon}
                </div>
                {action.badge && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                      {action.badge}
                    </span>
                  </div>
                )}
                <h4 className="font-semibold text-gray-900">{action.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{action.description}</p>
                <div className="mt-4">
                  <EnhancedButton 
                    variant="default" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(action.href);
                    }}
                  >
                    Open
                  </EnhancedButton>
                </div>
              </div>
            </EnhancedCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsEnhanced;
