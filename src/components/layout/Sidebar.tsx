
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Users, ClipboardList, Shield, LogIn, ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from './Logo';

// User type constants
const USER_TYPE = {
  RESIDENT: 'resident',
  SECURITY: 'security',
  ADMIN: 'admin'
};

interface SidebarProps {
  userType?: 'resident' | 'security' | 'admin';
}

const Sidebar: React.FC<SidebarProps> = ({ 
  userType = USER_TYPE.RESIDENT
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const residentNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Pre-Register Visitors', path: '/visitors/register', icon: User },
    { name: 'My Visitors', path: '/visitors', icon: Users },
    { name: 'Entry Logs', path: '/logs', icon: ClipboardList },
  ];
  
  const securityNavItems = [
    { name: 'Dashboard', path: '/security', icon: Home },
    { name: 'Visitor Access', path: '/security/access', icon: LogIn },
    { name: 'Incident Report', path: '/security/incident', icon: ClipboardList },
  ];
  
  const adminNavItems = [
    { name: 'Dashboard', path: '/admin', icon: Home },
    { name: 'Residents', path: '/admin/residents', icon: User },
    { name: 'Security Staff', path: '/admin/security', icon: Shield },
    { name: 'Visitors', path: '/admin/visitors', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: ClipboardList },
  ];
  
  let navItems;
  switch (userType) {
    case USER_TYPE.SECURITY:
      navItems = securityNavItems;
      break;
    case USER_TYPE.ADMIN:
      navItems = adminNavItems;
      break;
    default:
      navItems = residentNavItems;
  }
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div 
      className={`${collapsed ? 'w-16' : 'w-64'} h-screen bg-white border-r border-gray-200 fixed left-0 top-0 transition-all duration-300 flex flex-col z-10`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        {!collapsed && <Logo withName={true} />}
        {collapsed && <Logo withName={false} size="sm" />}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="h-6 w-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <nav className="flex-1 mt-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2.5 rounded-md text-sm transition-colors
                    ${active 
                      ? 'bg-navy/5 text-navy font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'}`
                  }
                >
                  <item.icon className={`${collapsed ? 'h-5 w-5' : 'h-4 w-4 mr-3'}`} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-3 border-t border-gray-100">
        <Link 
          to="/profile" 
          className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded-md transition-colors"
        >
          <div className="h-8 w-8 rounded-md bg-navy flex items-center justify-center text-white">
            {userType.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="text-sm font-medium">User Name</div>
              <div className="text-xs text-gray-500 capitalize">{userType}</div>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
