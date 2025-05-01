
import React from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import VisitorAccessControl from '@/components/visitors/VisitorAccessControl';

const ScanningPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const direction = queryParams.get('direction') || 'ingress';
  
  const pageTitle = `Visitor ${direction === 'ingress' ? 'Check-In' : 'Check-Out'}`;
  
  return (
    <MainLayout userType="security" pageTitle={pageTitle}>
      <VisitorAccessControl 
        initialDirection={direction as 'ingress' | 'egress'} 
      />
    </MainLayout>
  );
};

export default ScanningPage;
