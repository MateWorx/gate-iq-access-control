
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ScanDirection } from '../types';

// Define more specific types to avoid excessive type instantiations
interface ScanResultData {
  format?: string;
  text: string;
  timestamp?: string;
  type?: string;
  details?: Record<string, unknown>;
}

interface GeoLocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

interface ScanLogEntry {
  scanned_id: string;
  scan_type: string;
  scan_result: ScanResultData;
  geo_location?: GeoLocationData;
}

interface UseScanningLogicProps {
  initialScanType?: string;
  initialDirection?: ScanDirection;
}

export const useScanningLogic = ({ 
  initialScanType = 'id', 
  initialDirection = 'ingress' 
}: UseScanningLogicProps) => {
  const [scanType, setScanType] = useState<string>(initialScanType);
  const [scanning, setScanning] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [geoLocation, setGeoLocation] = useState<GeolocationCoordinates | null>(null);
  const [locationError, setLocationError] = useState<GeolocationPositionError | null>(null);
  const [direction, setDirection] = useState<ScanDirection>(initialDirection);
  const [timestamp, setTimestamp] = useState<string>(new Date().toISOString());
  
  // Get the user's location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      position => {
        setGeoLocation(position.coords);
        setTimestamp(new Date(position.timestamp).toISOString());
        setLocationError(null);
      },
      error => {
        setLocationError(error);
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleStartScan = useCallback(() => {
    setResult(null);
    setScanning(true);
  }, []);

  const processIDDocument = async (rawResult: string) => {
    try {
      // Parse ID document data
      const lines = rawResult.split('\n');
      const idNumber = lines.find(line => line.match(/^[0-9]{13}$/))?.trim() || '';
      
      // If we found an ID number, look up if there's a visitor with this ID
      if (idNumber) {
        const { data: visitorData, error } = await supabase
          .from('visitors')
          .select('*')
          .eq('id_number', idNumber)
          .single();
          
        if (error) {
          console.log("No visitor found with ID:", idNumber);
        } else if (visitorData) {
          console.log("Visitor found:", visitorData);
          // Log the scan in scan_logs table
          const scanLogData: ScanLogEntry = {
            scanned_id: idNumber,
            scan_type: 'id_document',
            scan_result: {
              text: rawResult,
              timestamp: new Date().toISOString(),
              type: 'id_document'
            },
          };
          
          if (geoLocation) {
            scanLogData.geo_location = {
              latitude: geoLocation.latitude,
              longitude: geoLocation.longitude,
              accuracy: geoLocation.accuracy,
              timestamp: timestamp
            };
          }

          const { error: logError } = await supabase
            .from('scan_logs')
            .insert([scanLogData]);
            
          if (logError) {
            console.error("Error logging scan:", logError);
          }
          
          toast({
            title: "ID Scanned Successfully",
            description: `ID Number: ${idNumber}`,
          });
        }
      }
      
      return idNumber || rawResult;
    } catch (error) {
      console.error("Error processing ID document:", error);
      return rawResult;
    }
  };
  
  const processVehicleLicense = async (rawResult: string) => {
    try {
      // Parse vehicle license data
      // This is a simplified placeholder implementation
      const registrationMatch = rawResult.match(/([A-Z0-9]{2,10})/);
      const registration = registrationMatch ? registrationMatch[0] : '';
      
      if (registration) {
        // Check if we have a visitor with this vehicle registration
        const { data: visitorData, error } = await supabase
          .from('visitors')
          .select('*')
          .filter('vehicle_disk->registration', 'eq', registration)
          .single();
          
        if (error) {
          console.log("No visitor found with registration:", registration);
        } else if (visitorData) {
          console.log("Visitor found:", visitorData);
          
          // Log the scan
          const scanLogData: ScanLogEntry = {
            scanned_id: registration,
            scan_type: 'vehicle_license',
            scan_result: {
              text: rawResult,
              timestamp: new Date().toISOString(),
              type: 'vehicle_license'
            }
          };
          
          if (geoLocation) {
            scanLogData.geo_location = {
              latitude: geoLocation.latitude,
              longitude: geoLocation.longitude,
              accuracy: geoLocation.accuracy,
              timestamp: timestamp
            };
          }

          const { error: logError } = await supabase
            .from('scan_logs')
            .insert([scanLogData]);
            
          if (logError) {
            console.error("Error logging scan:", logError);
          }
          
          toast({
            title: "Vehicle License Scanned",
            description: `Registration: ${registration}`,
          });
        }
      }
      
      return registration || rawResult;
    } catch (error) {
      console.error("Error processing vehicle license:", error);
      return rawResult;
    }
  };
  
  const processLicensePlate = async (rawResult: string) => {
    try {
      // Clean up the license plate text 
      const plate = rawResult.trim().toUpperCase();
      
      if (plate) {
        // Check if we have a visitor with this license plate
        const { data: visitorData, error } = await supabase
          .from('visitors')
          .select('*')
          .filter('vehicle_disk->licenseplate', 'eq', plate)
          .single();
          
        if (error) {
          console.log("No visitor found with license plate:", plate);
        } else if (visitorData) {
          console.log("Visitor found:", visitorData);
          
          // Log the scan
          const scanLogData: ScanLogEntry = {
            scanned_id: plate,
            scan_type: 'license_plate',
            scan_result: {
              text: rawResult,
              timestamp: new Date().toISOString(),
              type: 'license_plate'
            }
          };
          
          if (geoLocation) {
            scanLogData.geo_location = {
              latitude: geoLocation.latitude,
              longitude: geoLocation.longitude,
              accuracy: geoLocation.accuracy,
              timestamp: timestamp
            };
          }

          const { error: logError } = await supabase
            .from('scan_logs')
            .insert([scanLogData]);
            
          if (logError) {
            console.error("Error logging scan:", logError);
          }
          
          toast({
            title: "License Plate Scanned",
            description: `Plate: ${plate}`,
          });
        }
      }
      
      return plate || rawResult;
    } catch (error) {
      console.error("Error processing license plate:", error);
      return rawResult;
    }
  };

  const handleScanSuccess = useCallback(async (result: string, rawResult?: any) => {
    setScanning(false);
    console.log("Raw scan result:", result);

    let processedResult = result;

    // Process the scan based on type
    if (scanType === 'id') {
      processedResult = await processIDDocument(result);
    } else if (scanType === 'vehicle') {
      processedResult = await processVehicleLicense(result);
    } else if (scanType === 'anpr') {
      processedResult = await processLicensePlate(result);
    }

    setResult(processedResult);
  }, [scanType, geoLocation, timestamp]);

  const handleScanError = useCallback((error: Error) => {
    setScanning(false);
    console.error("Scan error:", error);
    toast({
      title: "Scan Error",
      description: error.message,
      variant: "destructive"
    });
  }, []);

  return {
    scanType,
    setScanType,
    scanning,
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
