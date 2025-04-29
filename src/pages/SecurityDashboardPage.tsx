
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SecurityDashboard from '@/components/dashboard/SecurityDashboard';

const SecurityDashboardPage: React.FC = () => {
  return (
    <MainLayout userType="security" pageTitle="Security Console">
      <SecurityDashboard />
    </MainLayout>
  );
};

export default SecurityDashboardPage;
