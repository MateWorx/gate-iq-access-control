import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ScanningInterface: React.FC<{ initialScanType?: string }> = ({ initialScanType = 'id' }) => {
  const [scanType, setScanType] = useState(initialScanType);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; message: string; details?: any }>(null);
  const [geoLocation, setGeoLocation] = useState<GeolocationCoordinates | null>(null);
  const { toast } = useToast();
  
  // Get current officer location when component loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation(position.coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Some features may be limited.",
            variant: "destructive"
          });
        }
      );
    }
  }, [toast]);
  
  const startScan = async () => {
    setScanning(true);
    setResult(null);
    
    // Simulate a scan process - in a real app, this would connect to a camera
    // and use OCR or barcode scanning capabilities
    setTimeout(async () => {
      try {
        // Get security officer ID (in production, this would come from auth context)
        // For now we'll simulate with a fixed ID
        const securityOfficerId = "simulated-officer-id";
        
        // Generate simulated scan data based on scan type
        let scanResult;
        let scannedId;
        
        if (scanType === 'id') {
          // Simulate scanning an ID document
          scannedId = "8001015009087";
          scanResult = {
            name: "John Doe",
            idNumber: scannedId,
            dateOfBirth: "1980-01-01",
            gender: "Male",
            citizenship: "South African",
            issueDate: "2018-05-10"
          };
          
          // Check if this visitor exists in our database (in a real app)
          const { data: visitorData, error: visitorError } = await supabase
            .from('visitors')
            .select('id, full_name, status, resident_id')
            .eq('id_number', scannedId)
            .maybeSingle();
            
          if (visitorError) {
            throw new Error(`Database error: ${visitorError.message}`);
          }
          
          // Store the scan log
          const { error: logError } = await supabase
            .from('scan_logs')
            .insert({
              security_officer_id: securityOfficerId,
              scanned_id: scannedId,
              scan_type: 'ID Scan',
              scan_result: scanResult,
              geo_location: geoLocation ? {
                latitude: geoLocation.latitude, 
                longitude: geoLocation.longitude,
                accuracy: geoLocation.accuracy
              } : null,
              visitor_id: visitorData?.id || null
            });
            
          if (logError) {
            console.error("Error logging scan:", logError);
          }
          
          // Set result based on database check
          if (visitorData) {
            setResult({
              success: true,
              message: `ID verified successfully: ${visitorData.full_name}`,
              details: {
                ...scanResult,
                visitorId: visitorData.id,
                status: visitorData.status
              }
            });
          } else {
            // ID scanned but not pre-registered
            setResult({
              success: true,
              message: `ID scanned successfully: ${scanResult.name}, not pre-registered`,
              details: scanResult
            });
          }
          
        } else {
          // Simulate scanning a vehicle license disk
          scannedId = "ABC123GP";
          scanResult = {
            make: "Toyota",
            model: "Corolla",
            registration: scannedId,
            licenseNumber: "GP12345678",
            vin: "ABCD123456789",
            expiryDate: "2025-12-31"
          };
          
          // Store the scan log
          const { error: logError } = await supabase
            .from('scan_logs')
            .insert({
              security_officer_id: securityOfficerId,
              scanned_id: scannedId,
              scan_type: 'Disk Scan',
              scan_result: scanResult,
              geo_location: geoLocation ? {
                latitude: geoLocation.latitude, 
                longitude: geoLocation.longitude,
                accuracy: geoLocation.accuracy
              } : null
            });
            
          if (logError) {
            console.error("Error logging scan:", logError);
          }
          
          setResult({
            success: true,
            message: `Vehicle verified: ${scanResult.make} ${scanResult.model}, REG: ${scanResult.registration}`,
            details: scanResult
          });
        }
        
      } catch (error) {
        console.error("Scan error:", error);
        setResult({
          success: false,
          message: `Scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        
        toast({
          title: "Scan Error",
          description: "There was a problem processing the scan. Please try again.",
          variant: "destructive"
        });
      }
      
      setScanning(false);
    }, 2000);
  };
  
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
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Scanning Interface</CardTitle>
        <CardDescription>
          Scan ID documents or vehicle license disks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="id" className="w-full" onValueChange={setScanType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="id">ID Document</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle License</TabsTrigger>
          </TabsList>
          <TabsContent value="id" className="mt-6 space-y-4">
            <div className="text-center">
              <p className="mb-4">Position the ID document in front of the camera</p>
              
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                {scanning ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
                    <p className="mt-4">Scanning...</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Search className="h-12 w-12 mx-auto mb-2" />
                    <p>Camera preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="vehicle" className="mt-6 space-y-4">
            <div className="text-center">
              <p className="mb-4">Position the license disk in front of the camera</p>
              
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                {scanning ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
                    <p className="mt-4">Scanning...</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Search className="h-12 w-12 mx-auto mb-2" />
                    <p>Camera preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {result && (
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
                  onClick={() => {
                    // In a real app, this would open a form to register this visitor/vehicle
                    toast({
                      title: "Registration",
                      description: "Registration form would open here"
                    });
                  }}
                >
                  Register
                </Button>
                <Button 
                  size="sm"
                  className="bg-lime hover:bg-lime-dark text-white"
                  onClick={() => {
                    // In a real app, this would check in the visitor
                    toast({
                      title: "Check-in",
                      description: "Visitor would be checked in"
                    });
                  }}
                >
                  {scanType === 'id' ? 'Check-in Person' : 'Check-in Vehicle'}
                </Button>
              </div>
            )}
          </div>
        )}
        
        {geoLocation && (
          <div className="mt-4 text-xs text-gray-500">
            <p>Location: {geoLocation.latitude.toFixed(6)}, {geoLocation.longitude.toFixed(6)} (±{geoLocation.accuracy.toFixed(0)}m)</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          className="bg-navy hover:bg-navy-light text-white w-full max-w-xs"
          onClick={startScan}
          disabled={scanning}
        >
          {scanning ? 'Scanning...' : 'Start Scan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScanningInterface;
