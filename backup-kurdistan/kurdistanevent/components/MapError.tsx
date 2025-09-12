import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const MapError: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg p-4">
            <div className="text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-2 text-lg font-display font-semibold">{t('maps.error.title')}</h3>
                <p className="mt-1 text-sm">{t('maps.error.message')}</p>
                <ul className="mt-4 text-sm text-left list-disc list-inside space-y-1">
                    <li>{t('maps.error.check1')}</li>
                    <li>{t('maps.error.check2')}</li>
                    <li>{t('maps.error.check3')}</li>
                </ul>
                <a 
                    href="https://developers.google.com/maps/documentation/javascript/error-messages#api-project-map-error"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm text-accent-blue dark:text-accent-blue/90 hover:underline"
                >
                    {t('maps.error.learnMore')}
                </a>
            </div>
        </div>
    );
};

export default MapError;