import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { useGoogleMapsScript } from '../hooks/useGoogleMapsScript';
import { MapPin } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import MapError from './MapError';
import { useMapsApiStatus } from '../context/MapsApiStatusContext';

interface LocationPickerProps {
    value: { address: string; latLng: string } | null;
    onChange: (value: { address: string; latLng: string }) => void;
}

const containerStyle = {
    width: '100%',
    height: '16rem', // h-64
};

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
    const { isLoaded, error: loadError } = useGoogleMapsScript();
    const { hasAuthError } = useMapsApiStatus();
    const { t } = useTranslation();
    // Fix: Replaced `google.maps.places.Autocomplete` with `any` to resolve missing namespace error.
    const [autocomplete, setAutocomplete] = useState<any | null>(null);
    
    const initialCenter = useMemo(() => {
        if (value) {
            const [lat, lng] = value.latLng.split(',');
            return { lat: parseFloat(lat), lng: parseFloat(lng) };
        }
        return { lat: 33.3152, lng: 44.3661 }; // Default to Baghdad, Iraq
    }, [value]);

    // Fix: Replaced `google.maps.places.Autocomplete` with `any` to resolve missing namespace error.
    const onAutocompleteLoad = useCallback((ac: any) => {
        setAutocomplete(ac);
    }, []);

    const onPlaceChanged = useCallback(() => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location && place.formatted_address) {
                const location = place.geometry.location;
                const latLng = `${location.lat()},${location.lng()}`;
                onChange({ address: place.formatted_address, latLng });
            }
        }
    }, [autocomplete, onChange]);

    if (loadError || hasAuthError) {
        return <MapError />;
    }

    if (!isLoaded) {
        return <div className="text-text-secondary text-sm">Loading location services...</div>;
    }
    
    return (
        <div className="space-y-4">
            <div className="relative">
                <MapPin className="absolute top-1/2 start-3 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <Autocomplete
                    onLoad={onAutocompleteLoad}
                    onPlaceChanged={onPlaceChanged}
                    options={{
                        fields: ["formatted_address", "geometry.location"],
                        types: ["geocode"],
                        componentRestrictions: { country: "iq" },
                    }}
                >
                    <input
                        type="text"
                        placeholder={t('createEvent.locationPlaceholder')}
                        defaultValue={value?.address || ''}
                        className="w-full ps-10 pe-3 py-2 border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:border-dark-border dark:text-dark-text-primary"
                    />
                </Autocomplete>
            </div>
             <div className="w-full h-64 bg-background dark:bg-dark-background rounded-md border border-border dark:border-dark-border overflow-hidden">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={initialCenter}
                    zoom={value ? 15 : 10}
                    options={{
                        disableDefaultUI: true,
                        zoomControl: true,
                    }}
                >
                    {value && <Marker position={initialCenter} />}
                </GoogleMap>
            </div>
        </div>
    );
};

export default LocationPicker;
