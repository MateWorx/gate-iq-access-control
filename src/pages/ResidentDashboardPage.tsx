
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ResidentDashboard from '@/components/dashboard/ResidentDashboard';

const ResidentDashboardPage: React.FC = () => {
  return (
    <MainLayout userType="resident" pageTitle="Resident Dashboard">
      <ResidentDashboard />
    </MainLayout>
  );
};

export default ResidentDashboardPage;
