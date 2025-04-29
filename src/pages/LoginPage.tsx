
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogin = (userType: string) => {
    // In a real app, we would validate credentials here
    
    // Redirect based on user type
    switch(userType) {
      case 'resident':
        navigate('/dashboard');
        break;
      case 'security':
        navigate('/security');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/dashboard');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark to-navy p-4">
      <div className="max-w-md w-full">
        <LoginForm onLogin={handleLogin} />
        
        <p className="text-white text-center mt-8 text-sm">
          Smart Access. Safe Communities.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
