
import React from 'react';

interface LocationDisplayProps {
  geoLocation: GeolocationCoordinates | null;
  timestamp: string;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ geoLocation, timestamp }) => {
  if (!geoLocation) return null;
  
  return (
    <div className="mt-4 text-xs text-gray-500">
      <p>Location: {geoLocation.latitude.toFixed(6)}, {geoLocation.longitude.toFixed(6)} (±{geoLocation.accuracy.toFixed(0)}m)</p>
      <p>Timestamp: {new Date(timestamp).toLocaleString()}</p>
    </div>
  );
};

export default LocationDisplay;
