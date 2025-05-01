
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ScanDirectionSelector from './scanning/ScanDirectionSelector';
import { supabase } from '@/integrations/supabase/client';
import { Search, ArrowRightCircle } from 'lucide-react';

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visitor Access Control</CardTitle>
        <CardDescription>
          Process visitor check-ins and check-outs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScanDirectionSelector 
          direction={direction} 
          onDirectionChange={setDirection} 
        />
        
        <div className="flex space-x-2">
          <Input
            placeholder="Enter visitor access code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={isLoading || !accessCode.trim()}
          >
            {isLoading ? "Searching..." : "Search"}
            <Search className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {visitorData && (
          <div className="mt-4 p-4 border rounded-md bg-slate-50">
            <h3 className="font-semibold text-lg">{visitorData.full_name}</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <span className="text-gray-500">Purpose:</span>
              <span>{visitorData.visit_purpose || 'Not specified'}</span>
              
              <span className="text-gray-500">Status:</span>
              <span className={`font-medium ${
                visitorData.status === 'Active' ? 'text-green-600' : 
                visitorData.status === 'Pending' ? 'text-amber-600' : 
                'text-gray-600'
              }`}>
                {visitorData.status}
              </span>
              
              <span className="text-gray-500">Expected Arrival:</span>
              <span>
                {visitorData.expected_arrival 
                  ? new Date(visitorData.expected_arrival).toLocaleString() 
                  : 'Not specified'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      
      {visitorData && (
        <CardFooter>
          <Button
            className={`w-full ${direction === 'ingress' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-red-600 hover:bg-red-700'} text-white`}
            onClick={handleProcessVisitor}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : (
              <>
                {direction === 'ingress' ? 'Check-In Visitor' : 'Check-Out Visitor'}
                <ArrowRightCircle className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default VisitorAccessControl;
