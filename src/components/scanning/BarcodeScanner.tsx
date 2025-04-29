
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, StopCircle, SwitchCamera, RefreshCcw, Car } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useToast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  onScanSuccess: (result: string, rawResult?: any) => void;
  onScanError?: (error: Error) => void;
  scannerActive: boolean;
  setScannerActive: (active: boolean) => void;
  captureMode?: 'barcode' | 'anpr';
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScanSuccess,
  onScanError,
  scannerActive,
  setScannerActive,
  captureMode = 'barcode'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNative, setIsNative] = useState<boolean>(Capacitor.isNativePlatform());
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const hints = new Map();
    // Configure to look for the appropriate barcode formats
    if (captureMode === 'barcode') {
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.PDF_417, 
        BarcodeFormat.QR_CODE,
        BarcodeFormat.DATA_MATRIX,
        BarcodeFormat.CODE_128
      ]);
    } else {
      // For ANPR, we'll use image capture, not barcode detection
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.QR_CODE, // Keep QR in case the license plate has a QR code
      ]);
    }
    
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
  }, [captureMode]);

  // Function to safely handle image processing
  const safeProcessImage = async (dataUrl: string) => {
    if (!dataUrl) {
      throw new Error("Failed to get image data");
    }

    try {
      // Create a new image element to ensure the image is fully loaded
      const img = new Image();
      
      // Return a promise that resolves when the image is loaded
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = dataUrl;
      });

      // If we're in ANPR mode, skip barcode detection and process as a license plate
      if (captureMode === 'anpr') {
        // In a real implementation, this would call an ANPR API
        // For now, we'll simulate recognition with a fake plate number
        simulateAnprProcessing(dataUrl);
        return null;
      }

      // Only after image is loaded, try to decode barcode
      if (codeReaderRef.current) {
        try {
          const result = await codeReaderRef.current.decodeFromImageUrl(dataUrl);
          return result;
        } catch (error) {
          console.error("Barcode decoding error:", error);
          throw error;
        }
      } else {
        throw new Error("Barcode reader not initialized");
      }
    } catch (error) {
      console.error("Image processing error:", error);
      throw error;
    }
  };

  // Function to simulate ANPR processing
  const simulateAnprProcessing = (imageUrl: string) => {
    // In a real implementation, this would call the PlateRecognizer API or similar
    console.log("Processing license plate image:", imageUrl.substring(0, 50) + "...");
    
    // Show a toast indicating processing
    toast({
      title: "Processing Number Plate",
      description: "Analyzing image...",
    });
    
    // Simulate API delay
    setTimeout(() => {
      // Generate a fake license plate result
      const provinces = ["GP", "MP", "EC", "WC", "KZN", "FS", "NW", "LP", "NC"];
      const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
      const randomLetters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                           String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const randomNumbers = Math.floor(Math.random() * 900 + 100);
      const fakePlate = `${randomLetters} ${randomNumbers} ${randomProvince}`;
      
      // Return the simulated result
      onScanSuccess(fakePlate, { 
        plate: fakePlate, 
        confidence: 0.95, 
        region: randomProvince 
      });
    }, 1500);
  };

  // Function to capture image using Capacitor Camera API
  const captureImage = async () => {
    try {
      setErrorMessage(null);
      const image = await CapacitorCamera.getPhoto({
        quality: captureMode === 'anpr' ? 95 : 90, // Higher quality for ANPR
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 2048,
        height: 2048,
        correctOrientation: true,
        presentationStyle: 'fullscreen',
      });

      const dataUrl = image.dataUrl;
      if (!dataUrl) {
        throw new Error("Failed to get image data");
      }

      setCapturedImage(dataUrl);
      
      // Process the captured image
      try {
        if (captureMode === 'anpr') {
          simulateAnprProcessing(dataUrl);
        } else {
          const result = await safeProcessImage(dataUrl);
          if (result) {
            onScanSuccess(result.getText(), result);
          }
        }
      } catch (error) {
        console.error("Failed to process image:", error);
        const errorMsg = captureMode === 'anpr' 
          ? "Could not recognize the license plate. Please try again with better lighting and focus."
          : "No barcode found in the image. Please try again with better lighting and focus.";
        
        setErrorMessage(errorMsg);
        
        if (onScanError && error instanceof Error) {
          onScanError(error);
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
          setCameraReady(false);
          
          if (captureMode === 'anpr' && !isNative) {
            // For web ANPR, we use a different approach
            // We'll capture a frame from the video stream when the user clicks a button
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
              .then(stream => {
                if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                  videoRef.current.play();
                  setCameraReady(true);
                }
              })
              .catch(err => {
                console.error("Error accessing camera:", err);
                setErrorMessage("Camera access failed. Please check permissions.");
                setScannerActive(false);
                if (onScanError) onScanError(err);
              });
            return;
          }
          
          // Standard barcode scanning with continuous detection
          try {
            await codeReaderRef.current?.decodeFromVideoDevice(
              undefined, // Use default device
              videoRef.current,
              (result, error) => {
                // Camera is now ready if we're getting callbacks
                if (!cameraReady) setCameraReady(true);
                
                if (result) {
                  // Successfully scanned a barcode
                  onScanSuccess(result.getText(), result);
                }
                
                if (error) {
                  // Only report fatal errors, not just "can't find barcode in this frame"
                  if (error.name !== 'NotFoundException') {
                    console.error("Scanning frame error:", error.name, error.message);
                    
                    // Handle "index not in range" errors by not propagating them to the user
                    if (error.name === 'IndexSizeError' || error.message.includes('index is not in the allowed range')) {
                      // Just log to console, don't show to user or call onScanError
                      // This is a common ZXing library error when processing frames
                      return;
                    }
                    
                    if (onScanError) {
                      onScanError(error);
                    }
                  }
                }
              }
            );
          } catch (error) {
            console.error("Failed to start scanner:", error);
            setErrorMessage("Error initializing scanner. Please try reloading the page.");
            setScannerActive(false);
            
            if (onScanError && error instanceof Error) {
              onScanError(error);
            }
          }
          
          // If we get here, camera initialization was successful
          setCameraReady(true);
          
        } catch (error) {
          console.error("Failed to start scanner:", error);
          setErrorMessage("Camera access failed. Please check permissions and try again.");
          setScannerActive(false);
          
          if (onScanError && error instanceof Error) {
            onScanError(error);
          }
        }
      } else {
        // Stop scanning
        if (codeReaderRef.current) {
          try {
            codeReaderRef.current.reset();
          } catch (error) {
            console.error("Error resetting scanner:", error);
          }
        }
        
        // Also stop any active video streams
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    };

    startWebScanner();

    return () => {
      // Reset when component unmounts or when active state changes
      if (codeReaderRef.current) {
        try {
          codeReaderRef.current.reset();
        } catch (error) {
          console.error("Error cleaning up scanner:", error);
        }
      }
      
      // Also clean up any active video streams
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [scannerActive, onScanSuccess, onScanError, setScannerActive, isNative, cameraReady, captureMode]);

  const toggleScanner = () => {
    if (isNative) {
      captureImage();
    } else {
      if (captureMode === 'anpr' && scannerActive) {
        // For ANPR on web, capture a frame from the video stream
        if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            setCapturedImage(dataUrl);
            simulateAnprProcessing(dataUrl);
          }
        }
      } else {
        setScannerActive(!scannerActive);
      }
    }
  };

  const handleReset = () => {
    setErrorMessage(null);
    setCapturedImage(null);
    
    // For web, restart scanning by toggling it off and on
    if (!isNative && scannerActive) {
      setScannerActive(false);
      setTimeout(() => setScannerActive(true), 300);
    }
  };

  return (
    <Card>
      <CardContent className="p-0 relative overflow-hidden">
        {errorMessage && (
          <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center p-4 z-10">
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <Button variant="outline" onClick={handleReset} size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
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
                  <p className="text-gray-500">
                    {captureMode === 'anpr' 
                      ? 'Tap the camera button to capture a license plate'
                      : 'Tap the camera button to scan'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <video 
              ref={videoRef}
              className="w-full h-64 bg-gray-100 object-cover"
              playsInline // Important for iOS
              muted
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
              {captureMode === 'anpr' ? (
                <Car className={`h-6 w-6 ${isNative ? 'text-blue-600' : (scannerActive ? 'text-red-600' : 'text-green-600')}`} />
              ) : isNative ? (
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
          
          {captureMode === 'anpr' && scannerActive && !isNative && (
            <div className="absolute bottom-2 left-2">
              <Button
                onClick={toggleScanner}
                variant="outline"
                size="sm"
                className="bg-green-100 rounded-full p-2 h-auto"
              >
                <Camera className="h-6 w-6 text-green-600" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeScanner;
