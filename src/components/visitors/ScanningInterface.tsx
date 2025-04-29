
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Search, CheckCircle, AlertCircle, LogIn, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BarcodeScanner from '../scanning/BarcodeScanner';

const ScanningInterface: React.FC<{ initialScanType?: string }> = ({ initialScanType = 'id' }) => {
  const [scanType, setScanType] = useState(initialScanType);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; message: string; details?: any }>(null);
  const [geoLocation, setGeoLocation] = useState<GeolocationCoordinates | null>(null);
  const [direction, setDirection] = useState<'ingress' | 'egress'>('ingress');
  const [timestamp, setTimestamp] = useState<string>('');
  const { toast } = useToast();
  
  // Get current officer location and timestamp when component loads
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
    
    // Set current timestamp
    updateTimestamp();
  }, [toast]);
  
  const updateTimestamp = () => {
    const now = new Date();
    setTimestamp(now.toISOString());
  };
  
  const handleScanSuccess = async (scannedText: string, rawResult?: any) => {
    try {
      updateTimestamp();
      
      // Get security officer ID (in production, this would come from auth context)
      // For now we'll simulate with a fixed ID
      const securityOfficerId = "simulated-officer-id";
      
      // Parse the scanned data based on scan type
      let scannedId, scanResult;
      
      if (scanType === 'id') {
        // In a real app, we'd parse the actual ID barcode data
        // For now we'll simulate with fixed data
        scannedId = scannedText || "8001015009087";
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
        
        // Store the scan log with direction and timestamp
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
            timestamp: timestamp,
            direction: direction,
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
              status: visitorData.status,
              direction: direction,
              timestamp: new Date(timestamp).toLocaleString()
            }
          });
        } else {
          // ID scanned but not pre-registered
          setResult({
            success: true,
            message: `ID scanned successfully: ${scanResult.name}, not pre-registered`,
            details: {
              ...scanResult,
              direction: direction,
              timestamp: new Date(timestamp).toLocaleString()
            }
          });
        }
        
      } else {
        // Simulate scanning a vehicle license disk
        scannedId = scannedText || "ABC123GP";
        scanResult = {
          make: "Toyota",
          model: "Corolla",
          registration: scannedId,
          licenseNumber: "GP12345678",
          vin: "ABCD123456789",
          expiryDate: "2025-12-31"
        };
        
        // Store the scan log with direction and timestamp
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
            } : null,
            timestamp: timestamp,
            direction: direction
          });
          
        if (logError) {
          console.error("Error logging scan:", logError);
        }
        
        setResult({
          success: true,
          message: `Vehicle verified: ${scanResult.make} ${scanResult.model}, REG: ${scanResult.registration}`,
          details: {
            ...scanResult,
            direction: direction,
            timestamp: new Date(timestamp).toLocaleString()
          }
        });
      }
      
      // Show success message
      toast({
        title: direction === 'ingress' ? "Entry Recorded" : "Exit Recorded",
        description: `${direction === 'ingress' ? 'Ingress' : 'Egress'} recorded at ${new Date(timestamp).toLocaleTimeString()}`,
        variant: "default"
      });
      
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
  };
  
  const handleScanError = (error: Error) => {
    console.error("Scan error:", error);
    if (error.name !== "NotFoundException") {
      toast({
        title: "Scanner Error",
        description: error.message,
        variant: "destructive"
      });
    }
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
        <Tabs defaultValue={scanType} className="w-full" onValueChange={setScanType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="id">ID Document</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle License</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 mb-4">
            <RadioGroup 
              defaultValue="ingress"
              className="flex items-center space-x-6" 
              onValueChange={(val) => setDirection(val as 'ingress' | 'egress')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ingress" id="ingress" className="border-green-500 text-green-500" />
                <Label htmlFor="ingress" className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-green-700">Ingress (In)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="egress" id="egress" className="border-red-500 text-red-500" />
                <Label htmlFor="egress" className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2 text-red-500" />
                  <span className="text-red-700">Egress (Out)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <TabsContent value="id" className="space-y-4">
            <div className="text-center">
              <p className="mb-4">Position the ID document in front of the camera</p>
              <BarcodeScanner 
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
                scannerActive={scanning}
                setScannerActive={setScanning}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="vehicle" className="space-y-4">
            <div className="text-center">
              <p className="mb-4">Position the license disk in front of the camera</p>
              <BarcodeScanner 
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
                scannerActive={scanning}
                setScannerActive={setScanning}
              />
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
                  className={direction === 'ingress' ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
                  onClick={() => {
                    // In a real app, this would check in the visitor
                    toast({
                      title: direction === 'ingress' ? "Check-in" : "Check-out",
                      description: `${scanType === 'id' ? 'Person' : 'Vehicle'} ${direction === 'ingress' ? 'checked in' : 'checked out'}`
                    });
                  }}
                >
                  {direction === 'ingress' 
                    ? `${scanType === 'id' ? 'Check-in Person' : 'Check-in Vehicle'}` 
                    : `${scanType === 'id' ? 'Check-out Person' : 'Check-out Vehicle'}`}
                </Button>
              </div>
            )}
          </div>
        )}
        
        {geoLocation && (
          <div className="mt-4 text-xs text-gray-500">
            <p>Location: {geoLocation.latitude.toFixed(6)}, {geoLocation.longitude.toFixed(6)} (±{geoLocation.accuracy.toFixed(0)}m)</p>
            <p>Timestamp: {new Date(timestamp).toLocaleString()}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          className={direction === 'ingress' 
            ? "bg-green-600 hover:bg-green-700 text-white w-full max-w-xs" 
            : "bg-red-600 hover:bg-red-700 text-white w-full max-w-xs"}
          onClick={() => setScanning(true)}
          disabled={scanning}
        >
          {scanning ? 'Scanning...' : 'Start Scan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScanningInterface;
