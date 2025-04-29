
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScanResult {
  success: boolean;
  message: string;
  details?: any;
}

interface ScanResultDisplayProps {
  result: ScanResult | null;
  scanType: string;
  direction: 'ingress' | 'egress';
}

const ScanResultDisplay: React.FC<ScanResultDisplayProps> = ({ 
  result, 
  scanType, 
  direction
}) => {
  const { toast } = useToast();

  if (!result) return null;

  const renderResultDetails = () => {
    if (!result || !result.details) return null;
    
    if (scanType === 'id') {
      return (
        <div className="mt-4 bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">ID Details:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Name:</div><div className="font-medium">{result.details.name}</div>
            <div>ID Number:</div><div className="font-medium">{result.details.idNumber}</div>
            <div>Date of Birth:</div><div className="font-medium">{result.details.dateOfBirth}</div>
            <div>Gender:</div><div className="font-medium">{result.details.gender}</div>
            <div>Citizenship:</div><div className="font-medium">{result.details.citizenship}</div>
          </div>
          
          {result.details.status && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center">
                <span className="mr-2">Visitor Status:</span>
                <span className={`font-medium ${result.details.status === 'Approved' ? 'text-green-600' : 'text-amber-600'}`}>
                  {result.details.status}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="mt-4 bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Vehicle Details:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Make & Model:</div><div className="font-medium">{result.details.make} {result.details.model}</div>
            <div>Registration:</div><div className="font-medium">{result.details.registration}</div>
            <div>License Number:</div><div className="font-medium">{result.details.licenseNumber}</div>
            <div>VIN:</div><div className="font-medium">{result.details.vin}</div>
            <div>Expires:</div><div className="font-medium">{result.details.expiryDate}</div>
          </div>
        </div>
      );
    }
  };

  const handleRegisterClick = () => {
    toast({
      title: "Registration",
      description: "Registration form would open here"
    });
  };

  const handleCheckInOutClick = () => {
    toast({
      title: direction === 'ingress' ? "Check-in" : "Check-out",
      description: `${scanType === 'id' ? 'Person' : 'Vehicle'} ${direction === 'ingress' ? 'checked in' : 'checked out'}`
    });
  };

  return (
    <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
      <div className="flex items-center">
        {result.success ? (
          <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
        ) : (
          <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
        )}
        <span className={result.success ? 'text-green-800' : 'text-red-800'}>
          {result.message}
        </span>
      </div>
      
      {renderResultDetails()}
      
      {result.success && (
        <div className="mt-4 flex justify-end space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRegisterClick}
          >
            Register
          </Button>
          <Button 
            size="sm"
            className={direction === 'ingress' ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
            onClick={handleCheckInOutClick}
          >
            {direction === 'ingress' 
              ? `${scanType === 'id' ? 'Check-in Person' : 'Check-in Vehicle'}` 
              : `${scanType === 'id' ? 'Check-out Person' : 'Check-out Vehicle'}`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScanResultDisplay;
