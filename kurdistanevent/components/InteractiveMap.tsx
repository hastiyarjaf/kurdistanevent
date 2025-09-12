import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMapsScript } from '../hooks/useGoogleMapsScript';
import MapError from './MapError';
import { useMapsApiStatus } from '../context/MapsApiStatusContext';

interface InteractiveMapProps {
  latLng: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ latLng }) => {
  const { isLoaded, error: loadError } = useGoogleMapsScript();
  const { hasAuthError } = useMapsApiStatus();

  if (loadError || hasAuthError) {
    return <MapError />;
  }

  if (!isLoaded) {
    return <div className="w-full h-full flex items-center justify-center bg-border dark:bg-dark-border rounded-lg">Loading map...</div>;
  }

  const [latStr, lngStr] = latLng.split(',');
  const position = { lat: parseFloat(latStr), lng: parseFloat(lngStr) };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={15}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      <Marker position={position} />
    </GoogleMap>
  );
};

export default InteractiveMap;
