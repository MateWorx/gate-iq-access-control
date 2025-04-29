
import React from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ScanningInterface from '@/components/visitors/ScanningInterface';

const ScanningPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const scanType = queryParams.get('type') || 'id';
  const direction = queryParams.get('direction') || 'ingress';
  
  const pageTitle = scanType === 'vehicle' 
    ? `Scan Vehicle ${direction === 'ingress' ? 'In' : 'Out'}`
    : `Scan ID ${direction === 'ingress' ? 'In' : 'Out'}`;
  
  return (
    <MainLayout userType="security" pageTitle={pageTitle}>
      <ScanningInterface 
        initialScanType={scanType} 
        initialDirection={direction as 'ingress' | 'egress'} 
      />
    </MainLayout>
  );
};

export default ScanningPage;
