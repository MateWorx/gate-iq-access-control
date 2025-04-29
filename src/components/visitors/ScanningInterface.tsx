
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ScanningInterface: React.FC = () => {
  const [scanType, setScanType] = useState('id');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; message: string }>(null);
  
  const startScan = () => {
    setScanning(true);
    setResult(null);
    
    // Simulate a scan process
    setTimeout(() => {
      setScanning(false);
      
      if (scanType === 'id') {
        setResult({
          success: true,
          message: 'ID verified successfully: John Doe, ID: 8001015009087'
        });
      } else {
        setResult({
          success: true,
          message: 'Vehicle verified: Toyota Corolla, REG: ABC123GP, Year: 2020'
        });
      }
    }, 2000);
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
          <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {result.message}
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
