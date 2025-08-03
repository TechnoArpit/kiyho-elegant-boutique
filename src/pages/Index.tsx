import React, { useState, useEffect } from 'react';
import AuthPage from '@/components/AuthPage';
import Dashboard from '@/components/Dashboard';

interface User {
  id: string;
  fullName: string;
  email: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = sessionStorage.getItem('kiyho_session');
    if (session) {
      try {
        const userData = JSON.parse(session);
        setUser(userData);
      } catch (error) {
        sessionStorage.removeItem('kiyho_session');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('kiyho_session');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kiyho-beige via-background to-kiyho-beige/50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-kiyho-black mb-4">
            Ki<span className="text-kiyho-orange">yho</span>
          </h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kiyho-orange mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default Index;
