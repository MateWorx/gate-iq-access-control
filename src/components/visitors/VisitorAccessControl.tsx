
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ScanDirectionSelector from './scanning/ScanDirectionSelector';
import VisitorSearch from './access/VisitorSearch';
import VisitorDetails from './access/VisitorDetails';
import ProcessVisitorButton from './access/ProcessVisitorButton';
import { VisitorData, ScanDirection } from './types';

interface VisitorAccessControlProps {
  initialDirection?: ScanDirection;
}

const VisitorAccessControl: React.FC<VisitorAccessControlProps> = ({
  initialDirection = 'ingress'
}) => {
  const [direction, setDirection] = useState<ScanDirection>(initialDirection);
  const [isLoading, setIsLoading] = useState(false);
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const { toast } = useToast();
  
  const handleVisitorFound = (visitor: VisitorData | null) => {
    setVisitorData(visitor);
  };
  
  const handleProcessVisitor = async () => {
    if (!visitorData) return;
    
    setIsLoading(true);
    
    try {
      const timestamp = new Date().toISOString();
      const updateData: any = {};
      
      if (direction === 'ingress') {
        updateData.check_in_time = timestamp;
        updateData.status = 'Active';
      } else {
        updateData.check_out_time = timestamp;
        updateData.status = 'Completed';
      }
      
      const { error } = await supabase
        .from('visitors')
        .update(updateData)
        .eq('id', visitorData.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: direction === 'ingress' ? "Check-In Successful" : "Check-Out Successful",
        description: `${visitorData.full_name} has been ${direction === 'ingress' ? 'checked in' : 'checked out'}.`,
      });
      
      // Clear form
      setVisitorData(null);
      
    } catch (error) {
      console.error("Error processing visitor:", error);
      toast({
        title: "Error",
        description: `Failed to ${direction === 'ingress' ? 'check in' : 'check out'} visitor`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="divide-y divide-gray-100">
      <div className="p-6">
        <h2 className="text-xl font-medium text-gray-800 mb-1">Visitor Access Control</h2>
        <p className="text-gray-500 text-sm mb-6">
          Process visitor check-ins and check-outs
        </p>
        
        <div className="mb-6">
          <ScanDirectionSelector 
            direction={direction} 
            onDirectionChange={setDirection} 
          />
        </div>
        
        <VisitorSearch 
          onVisitorFound={handleVisitorFound}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
        
      {visitorData && (
        <>
          <div className="p-6">
            <VisitorDetails visitor={visitorData} />
          </div>
          
          <div className="p-6">
            <ProcessVisitorButton
              direction={direction}
              isLoading={isLoading}
              onProcess={handleProcessVisitor}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VisitorAccessControl;
