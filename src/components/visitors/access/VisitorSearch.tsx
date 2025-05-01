
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { VisitorData } from '../types';

interface VisitorSearchProps {
  onVisitorFound: (visitor: VisitorData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const VisitorSearch: React.FC<VisitorSearchProps> = ({
  onVisitorFound,
  isLoading,
  setIsLoading
}) => {
  const [accessCode, setAccessCode] = useState('');
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
        onVisitorFound(data);
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
        onVisitorFound(null);
      }
    } catch (error) {
      console.error("Error searching for visitor:", error);
      toast({
        title: "Error",
        description: "Failed to search for visitor",
        variant: "destructive"
      });
      onVisitorFound(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};

export default VisitorSearch;
