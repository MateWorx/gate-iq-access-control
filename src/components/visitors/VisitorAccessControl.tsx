
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ScanDirectionSelector from './scanning/ScanDirectionSelector';
import { supabase } from '@/integrations/supabase/client';
import { Search, ArrowRightCircle, User, Calendar, Tag, Clock } from 'lucide-react';

interface VisitorAccessControlProps {
  initialDirection?: 'ingress' | 'egress';
}

interface VisitorData {
  id: string;
  full_name: string;
  visit_purpose: string | null;
  status: string;
  expected_arrival: string | null;
  resident_id: string | null;
}

const VisitorAccessControl: React.FC<VisitorAccessControlProps> = ({
  initialDirection = 'ingress'
}) => {
  const [direction, setDirection] = useState<'ingress' | 'egress'>(initialDirection);
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const { toast } = useToast();
  
  const handleSearch = async () => {
    if (!accessCode.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter an access code or visitor ID",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Search for visitor by access code
      const { data, error } = await supabase
        .from('visitors')
        .select('id, full_name, visit_purpose, status, expected_arrival, resident_id')
        .eq('access_code', accessCode.trim())
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setVisitorData(data);
        toast({
          title: "Visitor Found",
          description: `Found: ${data.full_name}`,
        });
      } else {
        toast({
          title: "Not Found",
          description: "No visitor found with this access code",
          variant: "destructive"
        });
        setVisitorData(null);
      }
    } catch (error) {
      console.error("Error searching for visitor:", error);
      toast({
        title: "Error",
        description: "Failed to search for visitor",
        variant: "destructive"
      });
      setVisitorData(null);
    } finally {
      setIsLoading(false);
    }
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
      setAccessCode('');
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
        
        <div className="flex space-x-2">
          <Input
            placeholder="Enter visitor access code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="flex-1 text-base font-normal border-gray-200 focus:ring-navy focus:border-navy"
          />
          <Button 
            onClick={handleSearch}
            disabled={isLoading || !accessCode.trim()}
            className="bg-navy hover:bg-navy-light"
          >
            {isLoading ? "Searching..." : "Search"}
            <Search className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
        
      {visitorData && (
        <>
          <div className="p-6">
            <h3 className="font-medium text-lg text-gray-800 mb-4">{visitorData.full_name}</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Tag className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Purpose</p>
                  <p className="text-base">{visitorData.visit_purpose || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <p className={`text-base font-medium ${
                    visitorData.status === 'Active' ? 'text-green-600' : 
                    visitorData.status === 'Pending' ? 'text-amber-600' : 
                    'text-gray-600'
                  }`}>
                    {visitorData.status}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Expected Arrival</p>
                  <p className="text-base">
                    {visitorData.expected_arrival 
                      ? new Date(visitorData.expected_arrival).toLocaleString() 
                      : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <Button
              className={`w-full h-12 text-base ${direction === 'ingress' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'} text-white`}
              onClick={handleProcessVisitor}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (
                <>
                  {direction === 'ingress' ? 'Check-In Visitor' : 'Check-Out Visitor'}
                  <ArrowRightCircle className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default VisitorAccessControl;
