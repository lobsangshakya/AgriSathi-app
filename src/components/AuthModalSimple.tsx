/**
 * Simplified Authentication Modal
 * Clean, simple login/signup for farmers
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  X, 
  Mail, 
  Phone, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/utils/utils';

interface AuthModalSimpleProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

type AuthMethod = 'email' | 'phone';

const AuthModalSimple = ({ isOpen, onClose, initialView = 'login' }: AuthModalSimpleProps) => {
  const { login, signUp, isLoading } = useUser();
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // Form states
  const [isSignUp, setIsSignUp] = useState(initialView === 'signup');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsSignUp(initialView === 'signup');
      resetForm();
    }
  }, [isOpen, initialView]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const validateForm = () => {
    setError(null);

    if (!email.trim()) {
      setError(language === 'hindi' ? 'ईमेल आवश्यक है' : 'Email is required');
      return false;
    }

    if (!password.trim()) {
      setError(language === 'hindi' ? 'पासवर्ड आवश्यक है' : 'Password is required');
      return false;
    }

    if (password.length < 6) {
      setError(language === 'hindi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए' : 'Password must be at least 6 characters');
      return false;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError(language === 'hindi' ? 'नाम आवश्यक है' : 'Name is required');
        return false;
      }

      if (password !== confirmPassword) {
        setError(language === 'hindi' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      let success = false;
      
      if (isSignUp) {
        success = await signUp(email, password, {
          name,
          phone,
          location: language === 'hindi' ? 'गाँव: रामपुर, जिला: मेरठ, उत्तर प्रदेश' : 'Village: Rampur, District: Meerut, UP',
          landSize: language === 'hindi' ? '2.5 एकड़' : '2.5 acres',
          experience: language === 'hindi' ? '15 साल' : '15 years',
          language: language,
          crops: language === 'hindi' ? ['गेहूं', 'धान', 'गन्ना', 'सरसों'] : ['Wheat', 'Rice', 'Sugarcane', 'Mustard'],
        });
      } else {
        success = await login(email, password);
      }
      
      if (success) {
        toast({
          title: language === 'hindi' ? 'सफलता!' : 'Success!',
          description: isSignUp 
            ? (language === 'hindi' ? 'खाता बनाया गया' : 'Account created successfully')
            : (language === 'hindi' ? 'लॉगिन सफल' : 'Login successful'),
        });
        onClose();
        navigate('/dashboard');
      }
    } catch (error) {
      // Handle authentication error silently
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchAuthMethod = (method: AuthMethod) => {
    setAuthMethod(method);
    setError(null);
  };

  const switchView = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isSignUp 
              ? (language === 'hindi' ? 'खाता बनाएं' : 'Sign Up')
              : (language === 'hindi' ? 'लॉगिन करें' : 'Login')
            }
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Auth Method Toggle */}
        <div className="flex p-6 pb-0">
          <div className="flex bg-gray-100 rounded-lg p-1 w-full">
            <button
              onClick={() => switchAuthMethod('email')}
              className={cn(
                "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
                authMethod === 'email' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Mail className="w-4 h-4 mr-2" />
              {language === 'hindi' ? 'ईमेल' : 'Email'}
            </button>
            <button
              onClick={() => switchAuthMethod('phone')}
              className={cn(
                "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
                authMethod === 'phone' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Phone className="w-4 h-4 mr-2" />
              {language === 'hindi' ? 'फोन' : 'Phone'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 pb-0">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Forms */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'hindi' ? 'पूरा नाम' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={language === 'hindi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'hindi' ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder={language === 'hindi' ? 'अपना ईमेल दर्ज करें' : 'Enter your email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isSubmitting || isLoading}
                />
              </div>
            </div>

            {/* Phone Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'hindi' ? 'फोन नंबर' : 'Phone Number'}
                </label>
                <Input
                  type="tel"
                  placeholder={language === 'hindi' ? '+91 98765 43210' : '+1 (555) 123-4567'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting || isLoading}
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'hindi' ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={language === 'hindi' ? 'अपना पासवर्ड दर्ज करें' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={isSubmitting || isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting || isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'hindi' ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={language === 'hindi' ? 'पासवर्ड फिर से दर्ज करें' : 'Re-enter your password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isSubmitting || isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting || isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp 
                    ? (language === 'hindi' ? 'खाता बनाया जा रहा है...' : 'Creating account...')
                    : (language === 'hindi' ? 'लॉगिन हो रहा है...' : 'Signing in...')
                  }
                </>
              ) : (
                isSignUp 
                  ? (language === 'hindi' ? 'खाता बनाएं' : 'Create Account')
                  : (language === 'hindi' ? 'लॉगिन करें' : 'Sign In')
              )}
            </Button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp 
                ? (language === 'hindi' ? 'पहले से ही खाता है?' : 'Already have an account?')
                : (language === 'hindi' ? 'खाता नहीं है?' : "Don't have an account?")
              }
              <button
                type="button"
                onClick={switchView}
                className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
              >
                {isSignUp 
                  ? (language === 'hindi' ? 'लॉगिन करें' : 'Sign In')
                  : (language === 'hindi' ? 'खाता बनाएं' : 'Sign Up')
                }
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 border-t">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            <span>{language === 'hindi' ? 'सुरक्षित और सुरक्षित' : 'Secure & Protected'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthModalSimple;
