
import React from 'react';
import { Bell, Search } from 'lucide-react';

interface TopBarProps {
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title = 'Dashboard' }) => {
  return (
    <div className="bg-[#FBFBFA] h-16 border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="h-9 w-64 pl-10 pr-4 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy transition-colors" 
          />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Estate Name</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
