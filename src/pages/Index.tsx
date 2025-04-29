
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/layout/Logo';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login after showing splash screen briefly
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-navy-dark to-navy">
      <div className="text-center">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <h1 className="text-4xl font-bold text-white mt-6 logo-text">
          GATE-<span className="text-lime">IQ</span>
        </h1>
        <p className="text-white mt-2">Smart Access. Safe Communities.</p>
      </div>
      
      <div className="mt-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime"></div>
      </div>
    </div>
  );
};

export default Index;
