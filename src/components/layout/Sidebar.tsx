
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Users, ClipboardList, Shield, Search } from 'lucide-react';
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
  
  const residentNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Pre-Register Visitors', path: '/visitors/register', icon: User },
    { name: 'My Visitors', path: '/visitors', icon: Users },
    { name: 'Entry Logs', path: '/logs', icon: ClipboardList },
  ];
  
  const securityNavItems = [
    { name: 'Dashboard', path: '/security', icon: Home },
    { name: 'Check-In', path: '/security/check-in', icon: User },
    { name: 'Scan ID/Disk', path: '/security/scan', icon: Search },
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
  
  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} h-screen bg-sidebar fixed left-0 top-0 transition-all duration-300 flex flex-col z-10`}>
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <Logo withName={true} />}
        {collapsed && <Logo withName={false} size="sm" />}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="h-6 w-6 flex items-center justify-center rounded-full bg-sidebar-accent text-white"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="flex-1 mt-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <Link 
          to="/profile" 
          className="flex items-center text-sidebar-foreground hover:bg-sidebar-accent p-2 rounded-md transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-sidebar-accent-foreground flex items-center justify-center text-sidebar-accent">
            {userType.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="text-sm font-medium">User Name</div>
              <div className="text-xs opacity-70 capitalize">{userType}</div>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
