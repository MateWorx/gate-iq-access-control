
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ScanningInterface from '@/components/visitors/ScanningInterface';

const ScanningPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const scanType = queryParams.get('type') || 'id';
  
  const pageTitle = scanType === 'vehicle' ? 'Scan Vehicle' : 'Scan ID';
  
  return (
    <MainLayout userType="security" pageTitle={pageTitle}>
      <ScanningInterface initialScanType={scanType} />
    </MainLayout>
  );
};

export default ScanningPage;
