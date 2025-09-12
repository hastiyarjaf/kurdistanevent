import React, { useState } from 'react';
import { getGoogleMapsApiKey } from '../hooks/useGoogleMapsScript';
import MapError from './MapError';

interface StaticMapProps {
  latLng: string;
  address: string;
  zoom?: number;
  width?: number;
  height?: number;
}

const API_KEY = getGoogleMapsApiKey();

const StaticMap: React.FC<StaticMapProps> = ({ latLng, address, zoom = 14, width = 400, height = 200 }) => {
  const [hasError, setHasError] = useState(false);

  if (!API_KEY || hasError) {
    return (
        <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden h-[200px]">
            <MapError />
        </div>
    );
  }

  const [lat, lng] = latLng.split(',');

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${API_KEY}`;

  return (
    <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
      <img
        src={mapUrl}
        alt={`Map of ${address}`}
        className="w-full h-auto"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default StaticMap;
