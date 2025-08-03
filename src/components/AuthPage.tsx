import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-image.jpg';

interface AuthPageProps {
  onLoginSuccess: (userData: any) => void;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const AuthPage = ({ onLoginSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isLogin) {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('kiyho_users') || '[]');
        const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
        
        if (user) {
          const userData = { ...user, password: undefined };
          sessionStorage.setItem('kiyho_session', JSON.stringify(userData));
          onLoginSuccess(userData);
          toast({
            title: "Welcome back!",
            description: `Hello ${user.fullName}, welcome to Kiyho.`,
          });
        } else {
          setErrors({ email: 'Invalid email or password' });
        }
      } else {
        // Register new user
        const users = JSON.parse(localStorage.getItem('kiyho_users') || '[]');
        const existingUser = users.find((u: any) => u.email === formData.email);
        
        if (existingUser) {
          setErrors({ email: 'An account with this email already exists' });
        } else {
          const newUser = {
            id: Date.now().toString(),
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            createdAt: new Date().toISOString()
          };
          
          users.push(newUser);
          localStorage.setItem('kiyho_users', JSON.stringify(users));
          
          const userData = { ...newUser, password: undefined };
          sessionStorage.setItem('kiyho_session', JSON.stringify(userData));
          onLoginSuccess(userData);
          
          toast({
            title: "Account created successfully!",
            description: `Welcome to Kiyho, ${formData.fullName}!`,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kiyho-beige via-background to-kiyho-beige/50 font-poppins">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen">
          {/* Hero Section */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="text-center space-y-6">
              <h1 className="text-6xl font-bold text-kiyho-black mb-4">
                Ki<span className="text-kiyho-orange">yho</span>
              </h1>
              <p className="text-xl text-kiyho-black/70 mb-8">
                Discover luxury handbags for the modern woman
              </p>
              <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-luxury)]">
                <img 
                  src={heroImage} 
                  alt="Elegant woman with luxury handbag" 
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-kiyho-black/20 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <div className="flex flex-col justify-center">
            <div className="text-center lg:hidden mb-8">
              <h1 className="text-4xl font-bold text-kiyho-black mb-2">
                Ki<span className="text-kiyho-orange">yho</span>
              </h1>
              <p className="text-kiyho-black/70">Premium Women's Handbags</p>
            </div>

            <Card className="w-full max-w-md mx-auto shadow-[var(--shadow-card)] border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex bg-kiyho-beige rounded-lg p-1">
                    <Button
                      variant={isLogin ? "luxury" : "ghost"}
                      size="sm"
                      onClick={() => setIsLogin(true)}
                      className="flex-1"
                    >
                      Login
                    </Button>
                    <Button
                      variant={!isLogin ? "luxury" : "ghost"}
                      size="sm"
                      onClick={() => setIsLogin(false)}
                      className="flex-1"
                    >
                      Register
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-kiyho-black">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <CardDescription className="text-kiyho-black/60">
                  {isLogin 
                    ? 'Sign in to your Kiyho account' 
                    : 'Join the Kiyho family today'
                  }
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-kiyho-black font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`bg-white border-kiyho-beige focus:border-kiyho-orange ${
                          errors.fullName ? 'border-destructive' : ''
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-kiyho-black font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`bg-white border-kiyho-beige focus:border-kiyho-orange ${
                        errors.email ? 'border-destructive' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-kiyho-black font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`bg-white border-kiyho-beige focus:border-kiyho-orange ${
                        errors.password ? 'border-destructive' : ''
                      }`}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-kiyho-black font-medium">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`bg-white border-kiyho-beige focus:border-kiyho-orange ${
                          errors.confirmPassword ? 'border-destructive' : ''
                        }`}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="luxury"
                    size="lg"
                    className="w-full mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;