/**
 * Enhanced Authentication Page - Email & Phone with OTP
 * Complete authentication system with multiple signup methods
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  MessageSquare,
  Shield
} from 'lucide-react';
import logo from '@/assets/AgriSathi Logo.png';

type AuthMethod = 'email' | 'phone';

const AuthEnhanced = ({ onAuth }: { onAuth: () => void }) => {
  const { 
    login, 
    signUp, 
    signUpWithPhone, 
    signInWithPhone, 
    sendOTP, 
    isLoading 
  } = useUser();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Form states
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // UI states
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // Form validation
  const validateEmailForm = () => {
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

  const validatePhoneForm = () => {
    setError(null);

    if (!phone.trim()) {
      setError(language === 'hindi' ? 'फोन नंबर आवश्यक है' : 'Phone number is required');
      return false;
    }

    if (!name.trim()) {
      setError(language === 'hindi' ? 'नाम आवश्यक है' : 'Name is required');
      return false;
    }

    if (!otp.trim()) {
      setError(language === 'hindi' ? 'OTP आवश्यक है' : 'OTP is required');
      return false;
    }

    if (phone.length < 10) {
      setError(language === 'hindi' ? 'फोन नंबर कम से कम 10 अंकों का होना चाहिए' : 'Phone number must be at least 10 digits');
      return false;
    }

    return true;
  };

  // Handle email form submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmailForm()) return;
    
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
          avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
        });
      } else {
        success = await login(email, password);
      }
      
      if (success) {
        onAuth();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP sending
  const handleSendOTP = async () => {
    if (!phone.trim()) {
      setError(language === 'hindi' ? 'फोन नंबर आवश्यक है' : 'Phone number is required');
      return;
    }

    if (phone.length < 10) {
      setError(language === 'hindi' ? 'फोन नंबर कम से कम 10 अंकों का होना चाहिए' : 'Phone number must be at least 10 digits');
      return;
    }

    const success = await sendOTP(phone);
    if (success) {
      setOtpSent(true);
      setOtpTimer(60);
      setCanResendOtp(false);
      
      // Start countdown timer
      const timer = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Handle phone form submission
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneForm()) return;
    
    setIsSubmitting(true);
    
    try {
      let success = false;
      
      if (isSignUp) {
        success = await signUpWithPhone(phone, name, otp);
      } else {
        success = await signInWithPhone(phone, otp);
      }
      
      if (success) {
        onAuth();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when switching auth methods
  const switchAuthMethod = (method: AuthMethod) => {
    setAuthMethod(method);
    setError(null);
    setOtpSent(false);
    setOtpTimer(0);
    setCanResendOtp(false);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setIsSignUp(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'hindi' ? 'वापस' : 'Back'}
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src={logo} 
            alt="AgriSathi Logo" 
            className="w-20 h-20 mb-4 rounded-xl shadow-lg"
          />
          <h1 className="text-2xl font-bold text-gradient text-center">
            {isSignUp 
              ? (language === 'hindi' ? 'AgriSathi में शामिल हों' : 'Join AgriSathi')
              : (language === 'hindi' ? 'AgriSathi में लॉगिन करें' : 'Login to AgriSathi')
            }
          </h1>
        </div>

        {/* Auth Method Toggle */}
        <div className="flex mb-6 bg-muted/50 rounded-lg p-1">
          <button
            onClick={() => switchAuthMethod('email')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              authMethod === 'email' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <Mail className="w-4 h-4 mr-2" />
            {language === 'hindi' ? 'ईमेल' : 'Email'}
          </button>
          <button
            onClick={() => switchAuthMethod('phone')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              authMethod === 'phone' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <Phone className="w-4 h-4 mr-2" />
            {language === 'hindi' ? 'फोन' : 'Phone'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Email Authentication Form */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {language === 'hindi' ? 'पूरा नाम' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {language === 'hindi' ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {language === 'hindi' ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting || isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {language === 'hindi' ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
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
              className="w-full py-3 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
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
        )}

        {/* Phone Authentication Form */}
        {authMethod === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {language === 'hindi' ? 'पूरा नाम' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {language === 'hindi' ? 'फोन नंबर' : 'Phone Number'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder={language === 'hindi' ? '+91 98765 43210' : '+1 (555) 123-4567'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  disabled={isSubmitting || isLoading}
                />
              </div>
            </div>

            {/* OTP Section */}
            {!otpSent ? (
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={handleSendOTP}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === 'hindi' ? 'OTP भेजा जा रहा है...' : 'Sending OTP...'}
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {language === 'hindi' ? 'OTP भेजें' : 'Send OTP'}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {language === 'hindi' ? 'OTP दर्ज करें' : 'Enter OTP'}
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={language === 'hindi' ? '6 अंकों का OTP' : 'Enter 6-digit OTP'}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting || isLoading}
                    maxLength={6}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {language === 'hindi' ? 'OTP नहीं आया?' : "Didn't receive OTP?"}
                  </span>
                  {otpTimer > 0 ? (
                    <span className="text-primary">
                      {language === 'hindi' ? `${otpTimer} सेकंड` : `${otpTimer}s`}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                      disabled={!canResendOtp || isSubmitting || isLoading}
                    >
                      {language === 'hindi' ? 'फिर से भेजें' : 'Resend'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              disabled={isSubmitting || isLoading || !otpSent}
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
                  ? (language === 'hindi' ? 'OTP के साथ खाता बनाएं' : 'Create Account with OTP')
                  : (language === 'hindi' ? 'OTP के साथ लॉगिन करें' : 'Sign In with OTP')
              )}
            </Button>
          </form>
        )}

        {/* Toggle Sign In/Sign Up */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {isSignUp 
              ? (language === 'hindi' ? 'पहले से ही खाता है?' : 'Already have an account?')
              : (language === 'hindi' ? 'खाता नहीं है?' : "Don't have an account?")
            }
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setOtpSent(false);
                setOtp('');
              }}
              className="ml-1 text-primary hover:text-primary/80 font-medium transition-colors"
              disabled={isSubmitting || isLoading}
            >
              {isSignUp 
                ? (language === 'hindi' ? 'लॉगिन करें' : 'Sign In')
                : (language === 'hindi' ? 'खाता बनाएं' : 'Sign Up')
              }
            </button>
          </p>
        </div>

        {/* Terms and Conditions */}
        {isSignUp && (
          <div className="mt-6 text-xs text-muted-foreground text-center">
            {language === 'hindi' 
              ? 'खाता बनाकर, आप हमारी शर्तों और गोपनीयता नीति से सहमत होते हैं'
              : 'By creating an account, you agree to our Terms and Privacy Policy'
            }
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuthEnhanced;
