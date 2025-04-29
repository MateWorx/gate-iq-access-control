
import React from 'react';
import { User, ClipboardList, Search, Shield, LogIn, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import VisitorsList from './VisitorsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const SecurityDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security Console</h2>
        <div className="flex space-x-3">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Report Incident
          </Button>
          <Button className="bg-lime hover:bg-lime-dark text-white">
            Check-In Visitor
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Active Visitors" 
          value="12" 
          icon={<User className="h-5 w-5" />}
        />
        <StatCard 
          title="Ingress Today" 
          value="18" 
          icon={<LogIn className="h-5 w-5" />}
        />
        <StatCard 
          title="Egress Today" 
          value="6" 
          icon={<LogOut className="h-5 w-5" />}
        />
        <StatCard 
          title="Incident Reports" 
          value="0" 
          icon={<Shield className="h-5 w-5" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Current Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <VisitorsList showActions={false} />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link 
                to="/security/scan?type=id&direction=ingress"
                className={cn(
                  "flex w-full items-center justify-start",
                  "bg-green-600 hover:bg-green-700 text-white", 
                  "h-10 px-4 py-2 rounded-md text-sm font-medium"
                )}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Scan ID for Ingress (In)
              </Link>
              <Link
                to="/security/scan?type=id&direction=egress"
                className={cn(
                  "flex w-full items-center justify-start",
                  "bg-red-600 hover:bg-red-700 text-white", 
                  "h-10 px-4 py-2 rounded-md text-sm font-medium"
                )}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Scan ID for Egress (Out)
              </Link>
              <Link 
                to="/security/scan?type=vehicle&direction=ingress"
                className={cn(
                  "flex w-full items-center justify-start",
                  "bg-green-600 hover:bg-green-700 text-white", 
                  "h-10 px-4 py-2 rounded-md text-sm font-medium"
                )}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Scan Vehicle for Ingress
              </Link>
              <Link
                to="/security/scan?type=vehicle&direction=egress"
                className={cn(
                  "flex w-full items-center justify-start",
                  "bg-red-600 hover:bg-red-700 text-white", 
                  "h-10 px-4 py-2 rounded-md text-sm font-medium"
                )}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Scan Vehicle for Egress
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Manual Visitor Entry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Officer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Officer Name</p>
              <p className="font-medium">John Smith</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Assigned Gate</p>
              <p className="font-medium">Main Entrance</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Shift Start</p>
              <p className="font-medium">06:00 AM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Shift End</p>
              <p className="font-medium">06:00 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
