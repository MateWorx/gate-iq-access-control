
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import VisitorRegistrationForm from '@/components/visitors/VisitorRegistrationForm';

const VisitorRegistrationPage: React.FC = () => {
  return (
    <MainLayout userType="resident" pageTitle="Pre-Register Visitor">
      <VisitorRegistrationForm />
    </MainLayout>
  );
};

export default VisitorRegistrationPage;
