import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, StopCircle } from 'lucide-react';

interface BarcodeScannerProps {
  onScanSuccess: (result: string, rawResult?: any) => void;
  onScanError?: (error: Error) => void;
  scannerActive: boolean;
  setScannerActive: (active: boolean) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScanSuccess,
  onScanError,
  scannerActive,
  setScannerActive
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const hints = new Map();
    // Configure to specifically look for PDF417 barcodes (commonly used in IDs/driver's licenses)
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.PDF_417]);
    
    // Other formats that might be useful for vehicle registration or other documents
    hints.set(DecodeHintType.TRY_HARDER, true);
    
    // Create a code reader instance focused on PDF417 format
    const codeReader = new BrowserMultiFormatReader(hints);
    codeReaderRef.current = codeReader;

    return () => {
      // Clean up on unmount
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  useEffect(() => {
    if (!codeReaderRef.current || !videoRef.current) return;

    const startScanner = async () => {
      if (scannerActive) {
        try {
          setErrorMessage(null);
          
          // Start continuous scanning from camera
          await codeReaderRef.current?.decodeFromVideoDevice(
            undefined, // Use default device
            videoRef.current,
            (result, error) => {
              if (result) {
                // Successfully scanned a barcode
                onScanSuccess(result.getText(), result);
              }
              
              if (error && onScanError) {
                // Only report fatal errors, not just "can't find barcode in this frame"
                if (error.name !== 'NotFoundException') {
                  onScanError(error);
                }
              }
            }
          );
        } catch (error) {
          console.error("Failed to start scanner:", error);
          setErrorMessage("Camera access failed. Please check permissions.");
          setScannerActive(false);
          
          if (onScanError && error instanceof Error) {
            onScanError(error);
          }
        }
      } else {
        // Stop scanning
        codeReaderRef.current?.reset();
      }
    };

    startScanner();

    return () => {
      // Reset when component unmounts or when active state changes
      codeReaderRef.current?.reset();
    };
  }, [scannerActive, onScanSuccess, onScanError, setScannerActive]);

  const toggleScanner = () => {
    setScannerActive(!scannerActive);
  };

  return (
    <Card>
      <CardContent className="p-0 relative overflow-hidden">
        {errorMessage && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center p-4 z-10">
            <p className="text-red-600">{errorMessage}</p>
          </div>
        )}
        <div className="relative">
          <video 
            ref={videoRef}
            className="w-full h-64 bg-gray-100 object-cover"
          />
          {!scannerActive && !errorMessage && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <p className="text-white">Scanner inactive</p>
            </div>
          )}
          <div className="absolute bottom-2 right-2">
            <Button
              onClick={toggleScanner}
              variant="outline"
              size="sm"
              className={`${scannerActive ? 'bg-red-100' : 'bg-green-100'} rounded-full p-2 h-auto`}
            >
              {scannerActive ? (
                <StopCircle className="h-6 w-6 text-red-600" />
              ) : (
                <Camera className="h-6 w-6 text-green-600" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeScanner;
