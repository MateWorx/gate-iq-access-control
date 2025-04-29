
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface MainLayoutProps {
  children: ReactNode;
  userType?: 'resident' | 'security' | 'admin';
  pageTitle?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  userType = 'resident',
  pageTitle = 'Dashboard'
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar userType={userType} />
      
      <div className="flex-1 ml-64">
        <TopBar title={pageTitle} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
