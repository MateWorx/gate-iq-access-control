
import React from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import VisitorAccessControl from '@/components/visitors/VisitorAccessControl';
import { Card, CardContent } from '@/components/ui/card';

const ScanningPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const direction = queryParams.get('direction') || 'ingress';
  
  const pageTitle = `Visitor ${direction === 'ingress' ? 'Check-In' : 'Check-Out'}`;
  
  return (
    <MainLayout userType="security" pageTitle={pageTitle}>
      <div className="space-y-6">
        <p className="text-gray-600 text-lg">
          {direction === 'ingress' 
            ? 'Process visitor arrivals by entering their access code below.'
            : 'Record visitor departures by entering their access code below.'
          }
        </p>
        
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0">
            <VisitorAccessControl 
              initialDirection={direction as 'ingress' | 'egress'} 
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ScanningPage;
