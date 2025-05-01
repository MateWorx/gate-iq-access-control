
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ScanDirection } from '@/components/visitors/types';

interface ScanLogicProps {
  initialScanType: string;
  initialDirection: ScanDirection;
}

// Define simple non-recursive types to avoid excessive depth
interface ScanResultData {
  success: boolean;
  message: string;
  details?: Record<string, unknown>; // Using Record<string, unknown> instead of any
}

// Define the geo location structure with explicit fields
interface GeoLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  // Avoid index signature for better type safety
}

export const useScanningLogic = ({ 
  initialScanType, 
  initialDirection 
}: ScanLogicProps) => {
  const [scanType, setScanType] = useState(initialScanType);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResultData | null>(null);
  const [geoLocation, setGeoLocation] = useState<GeolocationCoordinates | null>(null);
  const [locationError, setLocationError] = useState<GeolocationPositionError | null>(null);
  const [direction, setDirection] = useState<ScanDirection>(initialDirection);
  const [timestamp, setTimestamp] = useState<string>('');
  const { toast } = useToast();
  
  // Get current officer location and timestamp when component loads
  useEffect(() => {
    if (navigator.geolocation) {
      console.log("Requesting geolocation...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Geolocation success:", position.coords);
          setGeoLocation(position.coords);
          setLocationError(null);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(error);
          setGeoLocation(null);
          toast({
            title: "Location Error",
            description: `Unable to get your location: ${error.message}`,
            variant: "destructive"
          });
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation not supported by this browser");
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
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
      let scannedId: string;
      let scanResult: Record<string, unknown>; // Using Record<string, unknown> to avoid recursive types
      
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
        
        // Define the geo location data to store - with explicit type casting
        const geoLocationData: GeoLocationData | null = geoLocation ? {
          latitude: geoLocation.latitude, 
          longitude: geoLocation.longitude,
          accuracy: geoLocation.accuracy
        } : null;
        
        // Store the scan log with direction and timestamp
        const { error: logError } = await supabase
          .from('scan_logs')
          .insert({
            security_officer_id: securityOfficerId,
            scanned_id: scannedId,
            scan_type: 'ID Scan',
            scan_result: scanResult,
            geo_location: geoLocationData,
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
        
      } else if (scanType === 'anpr') {
        // Handle ANPR scan
        scannedId = scannedText || "AA 123 GP";
        
        // Check for matches in residents table with vehicle registration
        const { data: residentMatch, error: residentError } = await supabase
          .from('residents')
          .select('id, full_name, status')
          .eq('vehicle_disk->registration', scannedId)
          .maybeSingle();
          
        if (residentError) {
          console.error("Error checking resident:", residentError);
        }
        
        // Check for matches in visitors table with vehicle registration
        const { data: visitorMatch, error: visitorError } = await supabase
          .from('visitors')
          .select('id, full_name, status, resident_id')
          .eq('vehicle_disk->registration', scannedId)
          .maybeSingle();
          
        if (visitorError) {
          console.error("Error checking visitor:", visitorError);
        }
        
        // Create result with match status
        scanResult = {
          plate: scannedId,
          confidence: (rawResult?.confidence || 0.98) as number,
          region: (rawResult?.region || "GP") as string,
          matchStatus: residentMatch ? "Matched as Resident" : visitorMatch ? "Matched as Visitor" : "Unregistered",
          owner: residentMatch ? residentMatch.full_name : visitorMatch ? visitorMatch.full_name : undefined
        };
        
        // Define the geo location data to store with explicit typing
        const geoLocationData: GeoLocationData | null = geoLocation ? {
          latitude: geoLocation.latitude, 
          longitude: geoLocation.longitude,
          accuracy: geoLocation.accuracy
        } : null;
        
        // Log the scan
        const { error: logError } = await supabase
          .from('scan_logs')
          .insert({
            security_officer_id: securityOfficerId,
            scanned_id: scannedId,
            scan_type: 'ANPR Scan',
            scan_result: scanResult,
            geo_location: geoLocationData,
            timestamp: timestamp,
            direction: direction,
            visitor_id: visitorMatch?.id || null
          });
          
        if (logError) {
          console.error("Error logging ANPR scan:", logError);
        }
        
        // Set the result message based on the match status
        let resultMessage = "";
        if (residentMatch) {
          resultMessage = `License plate matched to resident: ${residentMatch.full_name}`;
        } else if (visitorMatch) {
          resultMessage = `License plate matched to visitor: ${visitorMatch.full_name}`;
        } else {
          resultMessage = `License plate detected: ${scannedId} - No matches found`;
        }
        
        setResult({
          success: true,
          message: resultMessage,
          details: {
            ...scanResult,
            direction: direction,
            timestamp: new Date(timestamp).toLocaleString()
          }
        });
        
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
        
        // Define the geo location data to store with explicit typing
        const geoLocationData: GeoLocationData | null = geoLocation ? {
          latitude: geoLocation.latitude, 
          longitude: geoLocation.longitude,
          accuracy: geoLocation.accuracy
        } : null;
        
        // Store the scan log with direction and timestamp
        const { error: logError } = await supabase
          .from('scan_logs')
          .insert({
            security_officer_id: securityOfficerId,
            scanned_id: scannedId,
            scan_type: 'Disk Scan',
            scan_result: scanResult,
            geo_location: geoLocationData,
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
    setResult(null);
  };

  return {
    scanType,
    setScanType,
    scanning,
    setScanning,
    result,
    geoLocation,
    locationError,
    direction,
    setDirection,
    timestamp,
    handleScanSuccess,
    handleScanError,
    handleStartScan
  };
};
