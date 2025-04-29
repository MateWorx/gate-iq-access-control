
import React from 'react';
import { User, ClipboardList, Search, Shield } from 'lucide-react';
import StatCard from './StatCard';
import VisitorsList from './VisitorsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

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
          title="Pending Arrivals" 
          value="5" 
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatCard 
          title="Scans Today" 
          value="34" 
          icon={<Search className="h-5 w-5" />}
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
              <Button 
                className="w-full bg-navy hover:bg-navy-light text-white justify-start"
                as={Link}
                to="/security/scan"
              >
                <Search className="mr-2 h-4 w-4" />
                Scan ID Document
              </Button>
              <Button 
                className="w-full bg-navy hover:bg-navy-light text-white justify-start"
                as={Link}
                to="/security/scan?type=vehicle"
              >
                <Search className="mr-2 h-4 w-4" />
                Scan Vehicle License Disk
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Manual Visitor Entry
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ClipboardList className="mr-2 h-4 w-4" />
                View Recent Check-ins
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
