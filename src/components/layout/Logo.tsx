
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withName?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md',
  withName = true
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`${sizeClasses[size]} aspect-square rounded-md bg-navy flex items-center justify-center relative overflow-hidden`}>
          {/* Gate Icon */}
          <div className="w-1/2 h-3/4 border-t-2 border-l-2 border-r-2 border-white/90 rounded-t-md"></div>
          
          {/* IQ Wave Pulse */}
          <div className="absolute bottom-1 left-0 right-0 flex justify-center">
            <div className="w-2/3 h-0.5 bg-lime animate-pulse-wave"></div>
          </div>
        </div>
      </div>
      
      {withName && (
        <div className="text-gray-800 font-medium tracking-tight">
          <span>GATE-</span>
          <span className="text-lime">IQ</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
