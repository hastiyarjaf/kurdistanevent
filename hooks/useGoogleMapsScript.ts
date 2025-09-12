import { useJsApiLoader } from '@react-google-maps/api';

const libraries: ('places')[] = ['places'];

// Export this utility for other components like StaticMap to use.
export const getGoogleMapsApiKey = (): string => {
    // Safely access Vite environment variables to prevent runtime errors if `import.meta.env` is undefined.
    // Cast `import.meta` to `any` to access the `env` property without TypeScript errors.
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        return (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '';
    }
    return '';
};


export const useGoogleMapsScript = () => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: getGoogleMapsApiKey(),
        libraries,
        region: 'IQ' // Bias results towards Iraq for better accuracy
    });

    return { isLoaded, error: loadError };
};