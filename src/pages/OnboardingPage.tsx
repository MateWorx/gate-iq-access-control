import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import OnboardingDashboard from '@/components/onboarding/OnboardingDashboard';

const OnboardingPage: React.FC = () => {
  return (
    <MainLayout userType="admin" pageTitle="Client Onboarding">
      <OnboardingDashboard />
    </MainLayout>
  );
};

export default OnboardingPage;
