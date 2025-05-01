
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRightCircle } from 'lucide-react';
import { ScanDirection } from '../types';

interface ProcessVisitorButtonProps {
  direction: ScanDirection;
  isLoading: boolean;
  onProcess: () => void;
}

const ProcessVisitorButton: React.FC<ProcessVisitorButtonProps> = ({ 
  direction, 
  isLoading, 
  onProcess 
}) => {
  return (
    <Button
      className={`w-full h-12 text-base ${direction === 'ingress' 
        ? 'bg-green-600 hover:bg-green-700' 
        : 'bg-red-600 hover:bg-red-700'} text-white`}
      onClick={onProcess}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : (
        <>
          {direction === 'ingress' ? 'Check-In Visitor' : 'Check-Out Visitor'}
          <ArrowRightCircle className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
};

export default ProcessVisitorButton;
