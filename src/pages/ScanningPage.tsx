
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ScanningInterface from '@/components/visitors/ScanningInterface';

const ScanningPage: React.FC = () => {
  return (
    <MainLayout userType="security" pageTitle="Scan ID/Vehicle">
      <ScanningInterface />
    </MainLayout>
  );
};

export default ScanningPage;
