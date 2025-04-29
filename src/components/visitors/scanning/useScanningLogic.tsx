
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ScanLogicProps {
  initialScanType: string;
  initialDirection: 'ingress' | 'egress';
}

export const useScanningLogic = ({ 
  initialScanType, 
  initialDirection 
}: ScanLogicProps) => {
  const [scanType, setScanType] = useState(initialScanType);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; message: string; details?: any }>(null);
  const [geoLocation, setGeoLocation] = useState<GeolocationCoordinates | null>(null);
  const [direction, setDirection] = useState<'ingress' | 'egress'>(initialDirection);
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

  const handleStartScan = () => {
    setScanning(true);
  };

  return {
    scanType,
    setScanType,
    scanning,
    setScanning,
    result,
    geoLocation,
    direction,
    setDirection,
    timestamp,
    handleScanSuccess,
    handleScanError,
    handleStartScan
  };
};
