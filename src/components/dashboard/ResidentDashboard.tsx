
import React from 'react';
import { Users, Calendar, ClipboardList } from 'lucide-react';
import StatCard from './StatCard';
import VisitorsList from './VisitorsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResidentDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Welcome Back, Resident</h2>
        <Button className="bg-lime hover:bg-lime-dark text-white">
          Pre-register Visitor
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Visitors" 
          value="2" 
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 20, isPositive: true }}
        />
        <StatCard 
          title="Upcoming Visitors" 
          value="1" 
          icon={<Calendar className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Total Visits" 
          value="42" 
          icon={<ClipboardList className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <VisitorsList />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Generate Visitor Access Code
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ClipboardList className="mr-2 h-4 w-4" />
              Download Entry Logs
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Unit Number:</span>
                <span className="font-medium">A-123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Registered Vehicle:</span>
                <span className="font-medium">ABC 123 GP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Contact Number:</span>
                <span className="font-medium">+27 123 456 7890</span>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  Update Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResidentDashboard;
