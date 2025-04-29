
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, StopCircle, SwitchCamera } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  const [isNative, setIsNative] = useState<boolean>(Capacitor.isNativePlatform());
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  useEffect(() => {
    const hints = new Map();
    // Configure to look for PDF417 barcodes (commonly used in IDs/driver's licenses)
    // and QR codes (might be used in some vehicle license disks)
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.PDF_417, 
      BarcodeFormat.QR_CODE,
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.CODE_128
    ]);
    
    // Try harder to detect barcodes
    hints.set(DecodeHintType.TRY_HARDER, true);
    
    // Create a code reader instance
    const codeReader = new BrowserMultiFormatReader(hints);
    codeReaderRef.current = codeReader;

    return () => {
      // Clean up on unmount
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  // Function to capture image using Capacitor Camera API
  const captureImage = async () => {
    try {
      setErrorMessage(null);
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1024,
        height: 1024,
        correctOrientation: true,
      });

      const dataUrl = image.dataUrl;
      if (!dataUrl) {
        throw new Error("Failed to get image data");
      }

      setCapturedImage(dataUrl);
      
      // Process the captured image with zxing library
      if (codeReaderRef.current) {
        try {
          const result = await codeReaderRef.current.decodeFromImageUrl(dataUrl);
          onScanSuccess(result.getText(), result);
        } catch (error) {
          console.error("Failed to decode image:", error);
          setErrorMessage("No barcode found in the image. Please try again.");
          if (onScanError && error instanceof Error) {
            onScanError(error);
          }
        }
      }
    } catch (error) {
      console.error("Camera error:", error);
      setErrorMessage("Camera access failed or user cancelled");
      if (onScanError && error instanceof Error) {
        onScanError(error);
      }
    }
  };

  useEffect(() => {
    if (!codeReaderRef.current || !videoRef.current || isNative) return;

    const startWebScanner = async () => {
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

    startWebScanner();

    return () => {
      // Reset when component unmounts or when active state changes
      codeReaderRef.current?.reset();
    };
  }, [scannerActive, onScanSuccess, onScanError, setScannerActive, isNative]);

  const toggleScanner = () => {
    if (isNative) {
      captureImage();
    } else {
      setScannerActive(!scannerActive);
    }
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
          {isNative ? (
            <div className="w-full h-64 bg-gray-100 relative">
              {capturedImage ? (
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">Tap the camera button to scan</p>
                </div>
              )}
            </div>
          ) : (
            <video 
              ref={videoRef}
              className="w-full h-64 bg-gray-100 object-cover"
            />
          )}
          
          {!scannerActive && !isNative && !errorMessage && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <p className="text-white">Scanner inactive</p>
            </div>
          )}
          
          <div className="absolute bottom-2 right-2">
            <Button
              onClick={toggleScanner}
              variant="outline"
              size="sm"
              className={`${isNative ? 'bg-blue-100' : (scannerActive ? 'bg-red-100' : 'bg-green-100')} rounded-full p-2 h-auto`}
            >
              {isNative ? (
                <Camera className="h-6 w-6 text-blue-600" />
              ) : scannerActive ? (
                <StopCircle className="h-6 w-6 text-red-600" />
              ) : (
                <Camera className="h-6 w-6 text-green-600" />
              )}
            </Button>
          </div>
          
          {isNative && (
            <div className="absolute bottom-2 left-2">
              <Button
                onClick={() => setCapturedImage(null)}
                variant="outline"
                size="sm"
                className="bg-gray-100 rounded-full p-2 h-auto"
                disabled={!capturedImage}
              >
                <SwitchCamera className="h-6 w-6 text-gray-600" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeScanner;
