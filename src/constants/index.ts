// Application constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.agrisathi.com',
  AI_SERVICE_URL: import.meta.env.VITE_AI_SERVICE_URL || 'https://ai.agrisathi.com',
  OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
  PLANT_ID_API_KEY: import.meta.env.VITE_PLANT_ID_API_KEY,
  AGRICULTURE_API_KEY: import.meta.env.VITE_AGRICULTURE_API_KEY,
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'AgriSathi',
  VERSION: '1.0.0',
  DESCRIPTION: 'Smart Agricultural Assistance System',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  DEFAULT_LANGUAGE: 'hindi',
  SUPPORTED_LANGUAGES: ['hindi', 'english'] as const,
} as const;

// UI Constants
export const UI_CONFIG = {
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  INFINITE_SCROLL_THRESHOLD: 100,
} as const;

// Crop Categories
export const CROP_CATEGORIES = [
  'tomato',
  'wheat', 
  'rice',
  'maize',
  'potato',
  'onion',
  'garlic',
  'chili',
  'brinjal',
  'cauliflower',
  'cabbage',
] as const;

// Community Categories
export const COMMUNITY_CATEGORIES = [
  'problem',
  'tips',
  'experience',
  'market',
  'general',
] as const;

// Disease Severity Levels
export const DISEASE_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// User Roles
export const USER_ROLES = {
  FARMER: 'farmer',
  EXPERT: 'expert',
  ADMIN: 'admin',
} as const;

// Service Types
export const SERVICE_TYPES = {
  EXPERT_CHAT: 'expert-chat',
  VOICE_CALL: 'voice-call',
  DISEASE_DETECTION: 'disease-detection',
  SOIL_ANALYSIS: 'soil-analysis',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_FILE_TYPE: 'Please select a valid image file',
  FILE_TOO_LARGE: 'File size should be less than 10MB',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  IMAGE_UPLOADED: 'Image uploaded successfully',
  POST_CREATED: 'Post created successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  MESSAGE_SENT: 'Message sent successfully',
} as const;
