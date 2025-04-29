
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useScanningLogic } from './scanning/useScanningLogic';
import ScanDirectionSelector from './scanning/ScanDirectionSelector';
import ScanResultDisplay from './scanning/ScanResultDisplay';
import LocationDisplay from './scanning/LocationDisplay';
import ScanningControls from './scanning/ScanningControls';

interface ScanningInterfaceProps {
  initialScanType?: string;
  initialDirection?: 'ingress' | 'egress';
}

const ScanningInterface: React.FC<ScanningInterfaceProps> = ({ 
  initialScanType = 'id',
  initialDirection = 'ingress'
}) => {
  const {
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
  } = useScanningLogic({ initialScanType, initialDirection });
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Scanning Interface</CardTitle>
        <CardDescription>
          Scan ID documents or vehicle license disks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScanDirectionSelector 
          direction={direction} 
          onDirectionChange={setDirection} 
        />
        
        <ScanningControls
          scanType={scanType}
          onScanTypeChange={setScanType}
          scanning={scanning}
          onStartScan={handleStartScan}
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
          direction={direction}
        />
        
        {result && (
          <ScanResultDisplay
            result={result}
            scanType={scanType}
            direction={direction}
          />
        )}
        
        <LocationDisplay 
          geoLocation={geoLocation} 
          timestamp={timestamp}
          error={locationError} 
        />
      </CardContent>
    </Card>
  );
};

export default ScanningInterface;
