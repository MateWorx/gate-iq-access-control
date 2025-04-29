
import React from 'react';
import { AlertCircle, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LocationDisplayProps {
  geoLocation: GeolocationCoordinates | null;
  timestamp: string;
  error?: GeolocationPositionError | null;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ geoLocation, timestamp, error }) => {
  // If there's a location error, display it
  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.code === 1 && 'Location access denied. Please enable location permissions in your browser or device settings.'}
          {error.code === 2 && 'Unable to determine your location. Please check your GPS/network and try again.'}
          {error.code === 3 && 'Location request timed out. Please try again in an area with better GPS signal.'}
          {!error.code && 'Location error: ' + error.message}
        </AlertDescription>
      </Alert>
    );
  }
  
  // If no location data yet, show pending message
  if (!geoLocation) {
    return (
      <div className="mt-4 text-xs text-gray-500">
        <p>Obtaining location...</p>
        <p className="mt-1">Make sure location services are enabled on your device.</p>
      </div>
    );
  }
  
  // Display location data
  return (
    <div className="mt-4 text-xs text-gray-500">
      <p className="flex items-center">
        <MapPin className="h-3 w-3 mr-1" />
        {geoLocation.latitude.toFixed(6)}, {geoLocation.longitude.toFixed(6)} (±{geoLocation.accuracy.toFixed(0)}m)
      </p>
      <p>Timestamp: {new Date(timestamp).toLocaleString()}</p>
    </div>
  );
};

export default LocationDisplay;
