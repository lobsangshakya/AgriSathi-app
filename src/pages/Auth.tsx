import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Phone, Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import logo from '@/assets/Logo.png';

const Auth = ({ onAuth }: { onAuth: () => void }) => {
  const { login } = useUser();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Form states
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  
  // UI states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // OTP timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateForm = () => {
    if (isSignUp) {
      if (!name.trim()) {
        setError(language === 'hindi' ? 'नाम आवश्यक है' : 'Name is required');
        return false;
      }
      if (!email.trim()) {
        setError(language === 'hindi' ? 'ईमेल आवश्यक है' : 'Email is required');
        return false;
      }
      if (!phone.trim()) {
        setError(language === 'hindi' ? 'फोन नंबर आवश्यक है' : 'Phone number is required');
        return false;
      }
      if (password.length < 6) {
        setError(language === 'hindi' ? 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए' : 'Password must be at least 6 characters');
        return false;
      }
      if (password !== confirmPassword) {
        setError(language === 'hindi' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
        return false;
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError(language === 'hindi' ? 'सभी फील्ड भरें' : 'Please fill all fields');
        return false;
      }
    }
    return true;
  };

  const sendOtp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOtpSent(true);
      setOtpTimer(30); // 30 seconds timer
      setCanResendOtp(false);
      
      toast({
        title: language === 'hindi' ? 'OTP भेजा गया' : 'OTP Sent',
        description: language === 'hindi' 
          ? `OTP ${phone} पर भेजा गया है` 
          : `OTP sent to ${phone}`,
      });
      
    } catch (error) {
      setError(language === 'hindi' ? 'OTP भेजने में समस्या' : 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError(language === 'hindi' ? '6 अंकों का OTP दर्ज करें' : 'Please enter 6-digit OTP');
      return;
    }
    
    setVerifyingOtp(true);
    setError(null);
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, accept any 6-digit OTP
      if (otp.length === 6) {
        const userData = {
          name: name,
          phone: phone,
          email: email,
          address: 'Bangalore, India',
          location: 'Bangalore, India',
          landSize: language === 'hindi' ? '2.5 एकड़' : '2.5 acres',
          experience: language === 'hindi' ? '15 साल' : '15 years',
          language: language,
          crops: language === 'hindi' ? ['गेहूं', 'धान', 'गन्ना', 'सरसों'] : ['Wheat', 'Rice', 'Sugarcane', 'Mustard']
        };
        
        login(userData);
        onAuth();
        
        toast({
          title: language === 'hindi' ? 'सफल पंजीकरण' : 'Registration Successful',
          description: language === 'hindi' ? 'आपका प्रोफाइल लोड हो रहा है...' : 'Loading your profile...',
        });
        
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } else {
        setError(language === 'hindi' ? 'गलत OTP' : 'Invalid OTP');
      }
    } catch (error) {
      setError(language === 'hindi' ? 'OTP सत्यापन में समस्या' : 'OTP verification error');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simple login for demo
      const userData = {
        name: language === 'hindi' ? 'राजेश कुमार' : 'Rajesh Kumar',
        phone: '+91 98765 43210',
        email: email,
        address: 'Bangalore, India',
        location: 'Bangalore, India',
        landSize: language === 'hindi' ? '2.5 एकड़' : '2.5 acres',
        experience: language === 'hindi' ? '15 साल' : '15 years',
        language: language,
        crops: language === 'hindi' ? ['गेहूं', 'धान', 'गन्ना', 'सरसों'] : ['Wheat', 'Rice', 'Sugarcane', 'Mustard']
      };
      
      login(userData);
      onAuth();
      
      toast({
        title: language === 'hindi' ? 'सफल लॉगिन' : 'Login Successful',
        description: language === 'hindi' ? 'आपका प्रोफाइल लोड हो रहा है...' : 'Loading your profile...',
      });
      
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
      
    } catch (error) {
      setError(language === 'hindi' ? 'लॉगिन में समस्या' : 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = () => {
    sendOtp();
  };

  const resetForm = () => {
    setOtpSent(false);
    setOtp('');
    setOtpTimer(0);
    setCanResendOtp(false);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-earth p-4">
      <Card className="p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img src={logo} alt="AgriSaathi" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isSignUp 
              ? (language === 'hindi' ? 'AgriSaathi में शामिल हों' : 'Join AgriSaathi')
              : (language === 'hindi' ? 'AgriSaathi में आपका स्वागत है' : 'Welcome to AgriSaathi')
            }
          </h2>
          <p className="text-muted-foreground">
            {isSignUp 
              ? (language === 'hindi' ? 'अपनी खेती को डिजिटल बनाएं' : 'Digitize your farming')
              : (language === 'hindi' ? 'अपने खाते में लॉगिन करें' : 'Sign in to your account')
            }
          </p>
        </div>
        
        {!otpSent ? (
          <form onSubmit={isSignUp ? (e) => { e.preventDefault(); sendOtp(); } : handleLogin} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={language === 'hindi' ? 'पूरा नाम' : 'Full Name'}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder={language === 'hindi' ? 'ईमेल' : 'Email'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            
            {isSignUp && (
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder={language === 'hindi' ? 'फोन नंबर' : 'Phone Number'}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={language === 'hindi' ? 'पासवर्ड' : 'Password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {isSignUp && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={language === 'hindi' ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}
            
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading 
                ? (language === 'hindi' ? 'लोड हो रहा है...' : 'Loading...') 
                : (isSignUp 
                    ? (language === 'hindi' ? 'OTP भेजें' : 'Send OTP')
                    : (language === 'hindi' ? 'लॉगिन करें' : 'Login')
                  )
              }
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'hindi' 
                  ? `OTP ${phone} पर भेजा गया है` 
                  : `OTP sent to ${phone}`
                }
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                type="text"
                placeholder={language === 'hindi' ? '6 अंकों का OTP दर्ज करें' : 'Enter 6-digit OTP'}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
              
              {otpTimer > 0 && (
                <p className="text-sm text-center text-muted-foreground">
                  {language === 'hindi' ? 'पुनः भेजें' : 'Resend'} ({otpTimer}s)
                </p>
              )}
              
              {canResendOtp && (
                <Button
                  variant="outline"
                  onClick={resendOtp}
                  className="w-full"
                  disabled={loading}
                >
                  {loading 
                    ? (language === 'hindi' ? 'भेज रहा है...' : 'Sending...') 
                    : (language === 'hindi' ? 'OTP पुनः भेजें' : 'Resend OTP')
                  }
                </Button>
              )}
              
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === 'hindi' ? 'वापस' : 'Back'}
                </Button>
                <Button
                  onClick={verifyOtp}
                  className="flex-1"
                  disabled={verifyingOtp || otp.length !== 6}
                >
                  {verifyingOtp 
                    ? (language === 'hindi' ? 'सत्यापित कर रहा है...' : 'Verifying...') 
                    : (language === 'hindi' ? 'सत्यापित करें' : 'Verify')
                  }
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              resetForm();
              setError(null);
            }}
            className="text-sm text-primary hover:underline"
          >
            {isSignUp 
              ? (language === 'hindi' ? 'पहले से खाता है? लॉगिन करें' : 'Already have an account? Login')
              : (language === 'hindi' ? 'नया खाता बनाएं' : 'Create new account')
            }
          </button>
        </div>
        
        {!isSignUp && (
          <div className="text-center text-sm text-muted-foreground">
            {language === 'hindi' 
              ? 'डेमो के लिए कोई भी ईमेल और पासवर्ड का उपयोग करें'
              : 'Use any email and password for demo'
            }
          </div>
        )}
      </Card>
    </div>
  );
};

export default Auth; 