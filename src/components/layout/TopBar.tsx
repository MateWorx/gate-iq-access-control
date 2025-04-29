
import React from 'react';
import { Bell } from 'lucide-react';

interface TopBarProps {
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title = 'Dashboard' }) => {
  return (
    <div className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-navy">{title}</h1>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Estate Name</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
