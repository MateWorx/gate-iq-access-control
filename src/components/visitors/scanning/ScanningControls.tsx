
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BarcodeScanner from '@/components/scanning/BarcodeScanner';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Camera, Loader2 } from 'lucide-react';

interface ScanningControlsProps {
  scanType: string;
  onScanTypeChange: (value: string) => void;
  scanning: boolean;
  onStartScan: () => void;
  onScanSuccess: (result: string, rawResult?: any) => void;
  onScanError: (error: Error) => void;
  direction: 'ingress' | 'egress';
}

const ScanningControls: React.FC<ScanningControlsProps> = ({
  scanType,
  onScanTypeChange,
  scanning,
  onStartScan,
  onScanSuccess,
  onScanError,
  direction,
}) => {
  return (
    <>
      <Tabs defaultValue={scanType} className="w-full" onValueChange={onScanTypeChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="id">ID Document</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle License</TabsTrigger>
        </TabsList>
        
        <TabsContent value="id" className="space-y-4">
          <div className="text-center">
            <p className="mb-4">Position the ID document in front of the camera</p>
            <BarcodeScanner 
              onScanSuccess={onScanSuccess}
              onScanError={onScanError}
              scannerActive={scanning}
              setScannerActive={onStartScan}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="vehicle" className="space-y-4">
          <div className="text-center">
            <p className="mb-4">Position the license disk in front of the camera</p>
            <BarcodeScanner 
              onScanSuccess={onScanSuccess}
              onScanError={onScanError}
              scannerActive={scanning}
              setScannerActive={onStartScan}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-center mt-4">
        <Button 
          className={direction === 'ingress' 
            ? "bg-green-600 hover:bg-green-700 text-white w-full max-w-xs" 
            : "bg-red-600 hover:bg-red-700 text-white w-full max-w-xs"}
          onClick={onStartScan}
          disabled={scanning}
        >
          {scanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Start Scan
            </>
          )}
        </Button>
      </CardFooter>
    </>
  );
};

export default ScanningControls;
